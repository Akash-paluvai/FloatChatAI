import { DashboardMetric, RecentQueryItem, DatasetItem } from '../types/dashboard';
import { ArgoFloat, OceanRegionData } from '../types/ocean';

export const MOCK_DASHBOARD_METRICS: DashboardMetric[] = [
  {
    id: 'metric-1',
    label: 'Active ARGO Floats',
    value: '3,842',
    change: '+4.2%',
    trend: 'up',
    description: 'Globally operational autonomous buoys',
    iconName: 'Radio',
  },
  {
    id: 'metric-2',
    label: 'Total Observations',
    value: '2,481,920',
    change: '+12.8%',
    trend: 'up',
    description: 'Profiles parsed across all oceans',
    iconName: 'Database',
  },
  {
    id: 'metric-3',
    label: 'Mean Surface Temp',
    value: '18.4 °C',
    change: '+0.3°C',
    trend: 'up',
    description: 'Global 30-day moving average',
    iconName: 'Thermometer',
  },
  {
    id: 'metric-4',
    label: 'Mean Salinity',
    value: '34.72 PSU',
    change: '-0.05',
    trend: 'down',
    description: 'Practical Salinity Units global mean',
    iconName: 'Droplet',
  },
];

export const MOCK_RECENT_QUERIES: RecentQueryItem[] = [
  {
    id: 'q-101',
    query: 'Show thermocline depth in Bay of Bengal 2024',
    timestamp: '12 mins ago',
    executionTime: '42ms',
    recordsCount: 1420,
    status: 'completed',
    region: 'Bay of Bengal',
  },
  {
    id: 'q-102',
    query: 'Salinity profile for Float #2901235 near Sri Lanka',
    timestamp: '1 hour ago',
    executionTime: '18ms',
    recordsCount: 380,
    status: 'cached',
    region: 'Indian Ocean',
  },
  {
    id: 'q-103',
    query: 'Deep ocean temperature anomalies below 1000m',
    timestamp: '3 hours ago',
    executionTime: '89ms',
    recordsCount: 5200,
    status: 'completed',
    region: 'Arabian Sea',
  },
  {
    id: 'q-104',
    query: 'Equatorial Pacific surface heat content analysis',
    timestamp: '5 hours ago',
    executionTime: '120ms',
    recordsCount: 8400,
    status: 'completed',
    region: 'Pacific Ocean',
  },
];

export const MOCK_DATASETS: DatasetItem[] = [
  { id: 'ds-1', name: 'ARGO Bay of Bengal 2024 Filtered', year: 2024, records: '482,000', fileSize: '3.1 GB', format: 'Parquet', status: 'Ready' },
  { id: 'ds-2', name: 'ARGO Arabian Sea 2023 Cleaned', year: 2023, records: '512,000', fileSize: '3.3 GB', format: 'Parquet', status: 'Ready' },
  { id: 'ds-3', name: 'Indian Ocean Historic Profiles 2022', year: 2022, records: '420,000', fileSize: '2.8 GB', format: 'NetCDF', status: 'Ready' },
  { id: 'ds-4', name: 'Global ARGO Float Trajectories 2024', year: 2024, records: '1,200,000', fileSize: '9.4 GB', format: 'CSV', status: 'Ready' },
];

export const MOCK_OCEAN_REGIONS: OceanRegionData[] = [
  { id: 'bob', name: 'Bay of Bengal', floatCount: 142, avgTemp: 28.3, avgSalinity: 33.4, bounds: [[10, 80], [22, 95]] },
  { id: 'as', name: 'Arabian Sea', floatCount: 198, avgTemp: 27.8, avgSalinity: 36.1, bounds: [[8, 55], [25, 78]] },
  { id: 'io', name: 'Southern Indian Ocean', floatCount: 310, avgTemp: 16.4, avgSalinity: 34.8, bounds: [[-45, 50], [-10, 110]] },
  { id: 'eqp', name: 'Equatorial Pacific', floatCount: 520, avgTemp: 26.5, avgSalinity: 34.9, bounds: [[-10, 140], [10, -90]] },
];

export const MOCK_DASHBOARD_FLOATS: ArgoFloat[] = [
  { id: 'f-1', wmoId: 2901234, latitude: 15.5, longitude: 88.2, depth: 10, temperature: 28.4, salinity: 33.2, lastUpdated: '2024-07-23', status: 'active', oceanRegion: 'Bay of Bengal' },
  { id: 'f-2', wmoId: 2901235, latitude: 12.1, longitude: 68.4, depth: 15, temperature: 27.9, salinity: 36.2, lastUpdated: '2024-07-23', status: 'active', oceanRegion: 'Arabian Sea' },
  { id: 'f-3', wmoId: 2901236, latitude: -18.4, longitude: 75.3, depth: 5, temperature: 21.3, salinity: 35.1, lastUpdated: '2024-07-22', status: 'active', oceanRegion: 'Southern Indian Ocean' },
  { id: 'f-4', wmoId: 2901237, latitude: 8.2, longitude: 92.1, depth: 25, temperature: 28.8, salinity: 33.0, lastUpdated: '2024-07-21', status: 'calibrating', oceanRegion: 'Bay of Bengal' },
  { id: 'f-5', wmoId: 2901238, latitude: 21.5, longitude: 62.8, depth: 10, temperature: 26.4, salinity: 36.5, lastUpdated: '2024-07-23', status: 'active', oceanRegion: 'Arabian Sea' },
];
