/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServiceResponse } from '../types/service';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export interface DashboardSummary {
  total_parquet_files: number;
  total_catalog_entries: number;
  estimated_total_observations: number;
  time_range: { start: string; end: string };
  spatial_bounds: { lat_min: number; lat_max: number; lon_min: number; lon_max: number };
  sample_statistics: {
    sample_file: string;
    sample_rows: number;
    mean_surface_temp: number | null;
    mean_salinity: number | null;
    depth_range: string;
    unique_positions: number;
  };
  datasets: Array<{
    file_name: string;
    size_mb: number;
    n_profiles_est: number;
    lat_range: string;
    lon_range: string;
    time_range: string;
  }>;
  regions: Array<{
    name: string;
    bbox: number[];
    description: string;
  }>;
  data_format: string;
  source: string;
}

export interface RegionStats {
  region_name?: string;
  total_observations?: number;
  avg_temp?: string;
  min_temp?: string;
  max_temp?: string;
  depth_range?: string;
  thermocline_gradient_depth?: string;
  spatial_centroid?: string;
  [key: string]: any;
}

export class DashboardService {
  /**
   * Fetch real dashboard summary from backend
   */
  static async getSummary(): Promise<ServiceResponse<DashboardSummary>> {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
      if (res.ok) {
        const json = await res.json();
        return {
          data: json.data,
          success: true,
          isMockData: false,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.warn('Dashboard API unreachable:', error);
    }

    // Fallback
    return {
      data: {
        total_parquet_files: 0,
        total_catalog_entries: 0,
        estimated_total_observations: 0,
        time_range: { start: '', end: '' },
        spatial_bounds: { lat_min: 0, lat_max: 0, lon_min: 0, lon_max: 0 },
        sample_statistics: { sample_file: '', sample_rows: 0, mean_surface_temp: null, mean_salinity: null, depth_range: '', unique_positions: 0 },
        datasets: [],
        regions: [],
        data_format: 'Unknown',
        source: 'Unavailable',
      } as DashboardSummary,
      success: false,
      isMockData: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Fetch real region stats from backend
   */
  static async getRegionStats(regionName: string): Promise<ServiceResponse<RegionStats>> {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/region-stats/${encodeURIComponent(regionName)}`);
      if (res.ok) {
        const json = await res.json();
        return { data: json.data, success: true, isMockData: false, timestamp: new Date().toISOString() };
      }
    } catch (error) {
      console.warn('Region stats API unreachable:', error);
    }
    return { data: {} as RegionStats, success: false, isMockData: true, timestamp: new Date().toISOString() };
  }
}
