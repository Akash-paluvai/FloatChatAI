export interface ArgoFloat {
  id: string;
  wmoId: number;
  latitude: number;
  longitude: number;
  depth: number; // meters
  temperature: number; // °C
  salinity: number; // PSU
  lastUpdated: string;
  status: 'active' | 'inactive' | 'calibrating';
  oceanRegion: string;
}

export interface TemperatureProfileData {
  depth: number;
  temperature: number;
  salinity: number;
  density?: number;
}

export interface OceanRegionData {
  id: string;
  name: string;
  floatCount: number;
  avgTemp: number;
  avgSalinity: number;
  bounds: [[number, number], [number, number]];
}
