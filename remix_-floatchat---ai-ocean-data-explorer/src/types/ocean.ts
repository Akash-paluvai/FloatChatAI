export interface ArgoMeasurement {
  depth: number; // meters (or pressure dbar)
  pressure: number; // dbar
  temperature: number; // °C
  salinity: number; // PSU
  oxygen?: number; // µmol/kg
}

export interface ArgoProfile {
  id: string;
  floatId: string;
  platformNumber: string;
  date: string;
  latitude: number;
  longitude: number;
  region: 'Bay of Bengal' | 'Arabian Sea' | 'Indian Ocean' | 'Southern Ocean' | 'Pacific Ocean';
  measurements: ArgoMeasurement[];
}

export interface ArgoFloat {
  id: string;
  platformNumber: string;
  institution: string;
  status: 'Active' | 'Archived';
  latitude: number;
  longitude: number;
  lastUpdate: string;
  profilesCount: number;
  region: string;
  profiles: ArgoProfile[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  generatedSql?: string;
  ragContext?: {
    retrievedDocs: number;
    matchedFloatIds: string[];
    relevanceScore: number;
  };
  mcpToolCall?: {
    toolName: string;
    arguments: Record<string, any>;
    status: 'success' | 'running' | 'failed';
  };
  mapData?: {
    title: string;
    points: { id: string; lat: number; lon: number; temp: number; salinity: number; floatId: string }[];
    center: [number, number];
    zoom: number;
  };
  chartData?: {
    title: string;
    type: 'depth-profile' | 'ts-diagram' | 'time-series' | 'salinity-dist';
    data: any[];
    xAxisLabel: string;
    yAxisLabel: string;
  };
  confidenceScore?: number;
  sources?: string[];
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  tech: string;
  iconName: string;
  inputFormat: string;
  outputFormat: string;
}

export interface FeatureCardItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tag: string;
  codeSnippet?: string;
}

export interface VizShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  previewType: 'heatmap' | 'trajectory' | 'depth' | 'timeseries' | 'salinity' | 'ts-diagram';
  metrics: { label: string; value: string }[];
}

export interface StatMetric {
  id: string;
  value: string;
  numberValue: number;
  suffix: string;
  label: string;
  sublabel: string;
  color: string;
}

export interface ImpactDomain {
  id: string;
  title: string;
  description: string;
  useCase: string;
  iconName: string;
  gradient: string;
}
