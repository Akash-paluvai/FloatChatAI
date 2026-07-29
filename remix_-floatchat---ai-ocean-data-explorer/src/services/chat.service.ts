import { ChatMessage, PresetQuery, PlotlyChartSpec, AnalyticsSummary } from '../types/chat';
import { ServiceResponse } from '../types/service';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const DEFAULT_PRESETS: PresetQuery[] = [
  { id: 'p1', query: 'Show temperature near Bay of Bengal', category: 'Temperature', icon: '🌡️' },
  { id: 'p2', query: 'Find salinity in Arabian Sea in 2023', category: 'Salinity', icon: '🧂' },
  { id: 'p3', query: 'Compare 2022 vs 2024 temperatures in Indian Ocean', category: 'Climate Change', icon: '📊' },
  { id: 'p4', query: 'Show temperature at 500m depth in Bay of Bengal', category: 'Temperature', icon: '🌊' },
  { id: 'p5', query: 'Map temperature across Indian Ocean', category: 'Temperature', icon: '🗺️' },
  { id: 'p6', query: 'Show T-S diagram for Arabian Sea', category: 'Salinity', icon: '📈' },
];

export class ChatService {
  /**
   * Fetch chat history — start with an initial greeting
   */
  static async getHistory(): Promise<ServiceResponse<ChatMessage[]>> {
    return {
      data: [{
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm **FloatChat**, your AI-powered oceanographic data explorer. I analyze **real ARGO float observations** across the Indian Ocean. Try asking about temperature profiles, salinity patterns, or multi-year comparisons!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }],
      success: true,
      isMockData: false,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Send user prompt to live FastAPI backend — receives real data charts & analytics
   */
  static async sendMessage(userPrompt: string): Promise<ServiceResponse<ChatMessage>> {
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userPrompt })
      });

      if (res.ok) {
        const json = await res.json();
        const apiData = json.data;

        // Parse viz_spec — backend returns an array of chart specs
        const vizSpecs: PlotlyChartSpec[] = Array.isArray(apiData.viz_spec)
          ? apiData.viz_spec
          : apiData.viz_spec ? [apiData.viz_spec] : [];

        // Parse analytics
        const analytics: AnalyticsSummary = apiData.analytical_summary || {};

        // Parse data table from artifacts
        const dataTable = apiData.artifacts?.data_table || apiData.tool_results?.notebook_dataframe_sample;

        const assistantMsg: ChatMessage = {
          id: apiData.message_id || `msg-${Date.now()}`,
          role: 'assistant',
          content: apiData.content || apiData.response_text || `Analysis completed for: "${userPrompt}".`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDemoPreview: false,
          sqlQuery: apiData.generated_sql,
          charts: vizSpecs,
          analytics: analytics,
          dataTable: dataTable,
          suggestedFollowups: apiData.suggested_followups || [],
        };

        return {
          data: assistantMsg,
          success: true,
          isMockData: false,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.warn('Backend connection failed:', error);
    }

    // Fallback
    return {
      data: {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Could not reach the FloatChat backend. Please ensure the server is running on port 8000.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      success: false,
      isMockData: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Fetch preset suggestion queries
   */
  static async getPresetQueries(): Promise<ServiceResponse<PresetQuery[]>> {
    return {
      data: DEFAULT_PRESETS,
      success: true,
      isMockData: false,
      timestamp: new Date().toISOString(),
    };
  }
}
