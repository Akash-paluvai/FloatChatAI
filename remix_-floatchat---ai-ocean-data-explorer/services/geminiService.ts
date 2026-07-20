import { GoogleGenAI } from "@google/genai";
import type { GeminiResponse, ChatMessage } from '../types';
import { SAMPLE_DATA } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function runQuery(
    query: string,
    chatHistory: ChatMessage[]
): Promise<GeminiResponse> {
    const stringifiedData = JSON.stringify(SAMPLE_DATA.map(({ id, latitude, longitude, profiles }) => ({ id, latitude, longitude, profiles })), null, 2);
    const recentHistory = chatHistory.slice(-6).map(msg => `${msg.sender}: ${msg.text}`).join('\n');

    const prompt = `
        You are FloatChat, an expert AI assistant for oceanographic data analysis.
        You have access to a JSON dataset of ARGO float data. Each float has multiple "profiles", which are measurements taken at different dates.
        Your task is to answer user queries based ONLY on this data.
        The current chat history is:
        ${recentHistory}

        Your available dataset is:
        ${stringifiedData}

        Based on the user's latest query: "${query}", you MUST respond with a single, minified JSON object with a 'type' and 'payload' field. DO NOT add any markdown formatting like \`\`\`json.

        Follow these rules for the response format:
        1. For general questions, respond with type: 'text'. The payload should be a string answer. Example: {"type":"text","payload":"The float 7900123 has 36 monthly profiles recorded."}
        
        2. If the user asks for float locations or to see the map (e.g., "show all floats on the map"), respond with type: 'action'. The payload MUST be {"action": "show_map"}. Example: {"type":"action","payload":{"action":"show_map"}}
        
        3. If the user asks for a plot or visualization (e.g., "plot temperature vs pressure for the latest profile of float 7900123"), respond with type: 'chart'. The payload must be an object with "title", "data", and "config". For time-series plots, find the correct profile's "measurements" array for the "data" field. Example: {"type":"chart","payload":{"title":"Temp vs. Pressure for 7900123 (latest)","data":[...],"config":{"xAxisKey":"pressure","yAxisKey":"temperature","chartType":"line"}}}
        
        4. If the user asks for a 'histogram' or 'distribution' of a variable over time for a specific float (e.g., 'histogram of surface temperature for 7900123'), respond with type: 'chart'. To create the payload:
           - Extract the surface measurement (the first element of the 'measurements' array) from ALL profiles of the requested float.
           - Create reasonable bins for the requested variable (e.g., temperature).
           - Count how many measurements fall into each bin.
           - The payload "data" MUST be an array of objects, each representing a bin, like [{"range":"22-24°C", "count":10}, {"range":"24-26°C", "count":15}].
           - The payload "config" MUST be: {"xAxisKey":"range", "yAxisKey":"count", "chartType":"bar"}.
           Example: {"type":"chart","payload":{"title":"Distribution of Surface Temperature for 7900123","data":[{"range":"22-24°C","count":10}],"config":{"xAxisKey":"range","yAxisKey":"count","chartType":"bar"}}}
        
        5. If the user asks for a 'linear regression', 'equation', 'relationship', or 'differential equation' between two variables (e.g., 'temperature vs pressure for float 7900123'), respond with type: 'equation'.
           - The payload must be an object with "title", "equation", "explanation", and "chartPayload".
           - Calculate the linear regression for the requested variables from the relevant profile (usually the latest if not specified).
           - The "equation" MUST be a string in the format "y_variable = m * x_variable + b".
           - The "explanation" should describe the relationship (e.g., how much y changes for a one-unit increase in x).
           - The "chartPayload" should contain the raw data points used for the regression. Its "config" should have "chartType":"line".
           - For "differential equation" requests, interpret this as finding the rate of change and provide the slope 'm' from the linear regression as the core of the explanation.
           Example: {"type":"equation","payload":{"title":"Linear Regression for 7900123: Temp vs. Pressure","equation":"temperature = -0.06 * pressure + 25.12","explanation":"This equation models the relationship between temperature and pressure. On average, temperature decreases by 0.06°C for every 1 dbar increase in pressure for this float's latest profile.","chartPayload":{"title":"Temp vs. Pressure for 7900123 (latest)","data":[{"pressure":10,"temperature":24.5},{"pressure":50,"temperature":22.1}],"config":{"xAxisKey":"pressure","yAxisKey":"temperature","chartType":"line"}}}}

        Strictly adhere to this JSON output format. Your entire response must be ONLY the JSON object.
    `;

    try {
        // Fix: Call `generateContent` directly on `ai.models` as per coding guidelines.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const rawJson = response.text.trim();
        // Handle cases where the model might still wrap the JSON in markdown
        const cleanedJson = rawJson.replace(/^```json\s*|```$/g, '');
        const parsedResponse = JSON.parse(cleanedJson);
        
        if (!parsedResponse.type || !parsedResponse.payload) {
            throw new Error("Invalid response format from AI.");
        }

        return parsedResponse as GeminiResponse;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof SyntaxError) {
             throw new Error(`Failed to parse AI response. Raw response was likely not valid JSON.`);
        }
        throw new Error("Failed to get a valid response from the AI.");
    }
}