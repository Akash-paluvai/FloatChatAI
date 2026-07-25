import { TemperatureProfileData } from '../types/ocean';
import { ServiceResponse } from '../types/service';
import { MOCK_CHAT_HISTORY } from '../mock/chat';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export class VisualizationService {
  static async getTemperatureProfile(region: string): Promise<ServiceResponse<TemperatureProfileData[]>> {
    try {
      const res = await fetch(`${API_BASE_URL}/visualization/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ocean_region: region || 'Bay of Bengal' })
      });
      if (res.ok) {
        const json = await res.json();
        const config = json.data.panels[0].config;
        const depths = config.data[0].y;
        const temps = config.data[0].x;

        const profileData: TemperatureProfileData[] = depths.map((d: number, idx: number) => ({
          depth: d,
          temperature: temps[idx],
          salinity: 33.2 + (idx * 0.2)
        }));

        return {
          data: profileData,
          success: true,
          isMockData: false,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('FastAPI visualization connection fallback:', e);
    }

    return {
      data: MOCK_CHAT_HISTORY[1].chartData || [],
      success: true,
      isMockData: true,
      timestamp: new Date().toISOString(),
    };
  }
}
