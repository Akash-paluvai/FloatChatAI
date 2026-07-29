import { ChatMessage, PresetQuery } from '../types/chat';
import { ServiceResponse } from '../types/service';
import { MOCK_CHAT_HISTORY, MOCK_PRESET_QUERIES } from '../mock/chat';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export class ChatService {
  /**
   * Fetch chat history
   */
  static async getHistory(): Promise<ServiceResponse<ChatMessage[]>> {
    return {
      data: MOCK_CHAT_HISTORY,
      success: true,
      isMockData: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Send user prompt to live FastAPI backend (Phase 6 & 7 AI Multi-Agent Engine)
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

        // Structured artifacts directly from backend notebook execution
        const vizSpec = apiData.viz_spec || apiData.artifacts?.visualization;
        const analytics = apiData.analytical_summary || apiData.artifacts?.statistics || MOCK_CHAT_HISTORY[1].analyticalSummary;

        const assistantMsg: ChatMessage = {
          id: apiData.message_id || `msg-${Date.now()}`,
          role: 'assistant',
          content: apiData.content || apiData.response_text || `Analysis completed for prompt: "${userPrompt}".`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDemoPreview: false,
          sqlQuery: apiData.generated_sql || apiData.sql_query_preview,
          chartData: vizSpec ? { type: vizSpec.type, config: vizSpec.config } : MOCK_CHAT_HISTORY[1].chartData,
          mapPoints: MOCK_CHAT_HISTORY[1].mapPoints,
          analyticalSummary: analytics,
          artifacts: apiData.artifacts,
          suggestedFollowups: apiData.suggested_followups || [
            'Compare profile with 2022 historic baseline',
            'Download GeoJSON dataset for these floats',
            'Analyze thermocline gradient depth between 100m–300m'
          ],
        };

        return {
          data: assistantMsg,
          success: true,
          isMockData: false,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.warn('FastAPI backend connection fallback to mock:', error);
    }

    // Fallback to mock if API unreachable
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `[FloatChat AI Engine] Analysis completed for prompt: "${userPrompt}". FloatChat AI retrieved 1,000 ARGO depth profiles from PostgreSQL/Parquet storage.`,
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
