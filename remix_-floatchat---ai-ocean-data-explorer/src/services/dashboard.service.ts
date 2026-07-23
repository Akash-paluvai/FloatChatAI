import { DashboardMetric, RecentQueryItem, DatasetItem } from '../types/dashboard';
import { ArgoFloat, OceanRegionData } from '../types/ocean';
import { ServiceResponse } from '../types/service';
import {
  MOCK_DASHBOARD_METRICS,
  MOCK_RECENT_QUERIES,
  MOCK_DATASETS,
  MOCK_OCEAN_REGIONS,
  MOCK_DASHBOARD_FLOATS,
} from '../mock/dashboard';

export class DashboardService {
  static async getMetrics(): Promise<ServiceResponse<DashboardMetric[]>> {
    await new Promise((res) => setTimeout(res, 150));
    return { data: MOCK_DASHBOARD_METRICS, success: true, isMockData: true, timestamp: new Date().toISOString() };
  }

  static async getRecentQueries(): Promise<ServiceResponse<RecentQueryItem[]>> {
    await new Promise((res) => setTimeout(res, 150));
    return { data: MOCK_RECENT_QUERIES, success: true, isMockData: true, timestamp: new Date().toISOString() };
  }

  static async getDatasets(): Promise<ServiceResponse<DatasetItem[]>> {
    await new Promise((res) => setTimeout(res, 150));
    return { data: MOCK_DATASETS, success: true, isMockData: true, timestamp: new Date().toISOString() };
  }

  static async getOceanRegions(): Promise<ServiceResponse<OceanRegionData[]>> {
    await new Promise((res) => setTimeout(res, 150));
    return { data: MOCK_OCEAN_REGIONS, success: true, isMockData: true, timestamp: new Date().toISOString() };
  }

  static async getActiveFloats(): Promise<ServiceResponse<ArgoFloat[]>> {
    await new Promise((res) => setTimeout(res, 150));
    return { data: MOCK_DASHBOARD_FLOATS, success: true, isMockData: true, timestamp: new Date().toISOString() };
  }
}
