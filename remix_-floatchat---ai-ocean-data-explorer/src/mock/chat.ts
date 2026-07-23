import { ChatMessage, PresetQuery } from '../types/chat';

export const MOCK_PRESET_QUERIES: PresetQuery[] = [
  { id: '1', query: 'Show temperature near Bay of Bengal', category: 'Temperature', icon: 'Thermometer' },
  { id: '2', query: 'Find salinity anomalies in Arabian Sea', category: 'Salinity', icon: 'Droplets' },
  { id: '3', query: 'List active ARGO floats in Indian Ocean', category: 'Float Status', icon: 'Radio' },
  { id: '4', query: 'Compare 2022 vs 2024 surface ocean heat', category: 'Climate Change', icon: 'TrendingUp' },
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Show temperature near Bay of Bengal.',
    timestamp: '10:42 AM',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: 'Here is the temperature profile and active ARGO float distribution retrieved for the Bay of Bengal region (15.5°N, 88.2°E) between 0m to 2000m depth.',
    timestamp: '10:42 AM',
    isDemoPreview: true,
    sqlQuery: `SELECT depth_m, temp_celsius, salinity_psu, latitude, longitude 
FROM argo_profiles 
WHERE ocean_region = 'Bay of Bengal' 
  AND timestamp >= '2024-01-01' 
ORDER BY depth_m ASC 
LIMIT 1000;`,
    chartData: [
      { depth: 0, temperature: 28.5, salinity: 33.2 },
      { depth: 50, temperature: 27.2, salinity: 33.8 },
      { depth: 100, temperature: 24.1, salinity: 34.5 },
      { depth: 200, temperature: 18.3, salinity: 34.8 },
      { depth: 500, temperature: 10.4, salinity: 35.0 },
      { depth: 1000, temperature: 6.2, salinity: 34.9 },
      { depth: 1500, temperature: 3.8, salinity: 34.8 },
      { depth: 2000, temperature: 2.1, salinity: 34.7 },
    ],
    mapPoints: [
      { id: 'float-2901234', wmoId: 2901234, latitude: 15.5, longitude: 88.2, depth: 10, temperature: 28.4, salinity: 33.2, lastUpdated: '2024-07-23', status: 'active', oceanRegion: 'Bay of Bengal' },
      { id: 'float-2901235', wmoId: 2901235, latitude: 14.8, longitude: 89.1, depth: 15, temperature: 28.6, salinity: 33.1, lastUpdated: '2024-07-22', status: 'active', oceanRegion: 'Bay of Bengal' },
      { id: 'float-2901236', wmoId: 2901236, latitude: 16.2, longitude: 87.5, depth: 5, temperature: 28.1, salinity: 33.5, lastUpdated: '2024-07-23', status: 'active', oceanRegion: 'Bay of Bengal' },
      { id: 'float-2901237', wmoId: 2901237, latitude: 13.9, longitude: 86.8, depth: 20, temperature: 27.9, salinity: 33.7, lastUpdated: '2024-07-21', status: 'calibrating', oceanRegion: 'Bay of Bengal' },
    ],
    analyticalSummary: {
      avgTemp: '28.3°C (Surface)',
      maxDepth: '2,000 meters',
      salinityRange: '33.2 – 35.0 PSU',
      anomalyDetected: false,
    },
    suggestedFollowups: [
      'Compare this profile with 2022 historic baseline',
      'Download GeoJSON dataset for these floats',
      'Analyze thermocline gradient depth between 100m–300m',
    ],
  },
];
