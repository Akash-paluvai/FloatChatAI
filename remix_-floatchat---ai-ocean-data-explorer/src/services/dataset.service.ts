import { DatasetItem } from '../types/dashboard';
import { ServiceResponse } from '../types/service';
import { MOCK_DATASETS } from '../mock/dashboard';

export class DatasetService {
  static async listDatasets(): Promise<ServiceResponse<DatasetItem[]>> {
    return { data: MOCK_DATASETS, success: true, isMockData: true, timestamp: new Date().toISOString() };
  }

  static async downloadDataset(id: string): Promise<ServiceResponse<{ url: string; fileName: string }>> {
    const ds = MOCK_DATASETS.find((d) => d.id === id) || MOCK_DATASETS[0];
    return {
      data: {
        url: `#mock-download-${ds.id}`,
        fileName: `${ds.name.toLowerCase().replace(/\s+/g, '_')}.${ds.format.toLowerCase()}`,
      },
      success: true,
      isMockData: true,
      timestamp: new Date().toISOString(),
    };
  }
}
