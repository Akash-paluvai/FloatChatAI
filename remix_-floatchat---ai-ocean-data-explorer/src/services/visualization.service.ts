import { TemperatureProfileData } from '../types/ocean';
import { ServiceResponse } from '../types/service';
import { MOCK_CHAT_HISTORY } from '../mock/chat';

export class VisualizationService {
  static async getTemperatureProfile(region: string): Promise<ServiceResponse<TemperatureProfileData[]>> {
    return {
      data: MOCK_CHAT_HISTORY[1].chartData || [],
      success: true,
      isMockData: true,
      timestamp: new Date().toISOString(),
    };
  }
}
