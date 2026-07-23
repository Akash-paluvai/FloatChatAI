import { ArgoFloat, OceanRegionData } from './ocean';

export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
  iconName: string;
}

export interface RecentQueryItem {
  id: string;
  query: string;
  timestamp: string;
  executionTime: string;
  recordsCount: number;
  status: 'completed' | 'cached' | 'failed';
  region: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  year: number;
  records: string;
  fileSize: string;
  format: 'Parquet' | 'NetCDF' | 'CSV';
  downloadUrl?: string;
  status: 'Ready' | 'Processing';
}
