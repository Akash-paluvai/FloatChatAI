import { ChatMessage, PresetQuery } from '../types/chat';
import { ServiceResponse } from '../types/service';
import { MOCK_CHAT_HISTORY, MOCK_PRESET_QUERIES } from '../mock/chat';

export class ChatService {
  /**
   * Fetch chat history (Phase 1 mock, Phase 2 connects to FastAPI)
   */
  static async getHistory(): Promise<ServiceResponse<ChatMessage[]>> {
    await new Promise((res) => setTimeout(res, 200)); // Simulating async network delay
    return {
      data: MOCK_CHAT_HISTORY,
      success: true,
      isMockData: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Send user prompt and retrieve mock response
   */
  static async sendMessage(userPrompt: string): Promise<ServiceResponse<ChatMessage>> {
    await new Promise((res) => setTimeout(res, 600));

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `[Demo Preview] Analysis completed for prompt: "${userPrompt}". FloatChat AI retrieved 1,000 ARGO depth profiles from PostgreSQL/Parquet storage.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDemoPreview: true,
      sqlQuery: `SELECT depth_m, temp_celsius, salinity_psu, latitude, longitude\nFROM argo_profiles\nWHERE search_vector @@ plainto_tsquery('${userPrompt.replace(/'/g, "''")}')\nLIMIT 1000;`,
      chartData: MOCK_CHAT_HISTORY[1].chartData,
      mapPoints: MOCK_CHAT_HISTORY[1].mapPoints,
      analyticalSummary: MOCK_CHAT_HISTORY[1].analyticalSummary,
      suggestedFollowups: [
        'Filter observations by thermocline boundary',
        'Export CSV dataset for statistical validation',
        'Inspect raw netCDF telemetry metadata',
      ],
    };

    return {
      data: assistantMsg,
      success: true,
      isMockData: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Fetch preset suggestion queries
   */
  static async getPresetQueries(): Promise<ServiceResponse<PresetQuery[]>> {
    return {
      data: MOCK_PRESET_QUERIES,
      success: true,
      isMockData: true,
      timestamp: new Date().toISOString(),
    };
  }
}
