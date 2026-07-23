import { TemperatureProfileData, ArgoFloat } from './ocean';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isDemoPreview?: boolean;
  sqlQuery?: string;
  chartData?: TemperatureProfileData[];
  mapPoints?: ArgoFloat[];
  suggestedFollowups?: string[];
  analyticalSummary?: {
    avgTemp: string;
    maxDepth: string;
    salinityRange: string;
    anomalyDetected: boolean;
  };
}

export interface PresetQuery {
  id: string;
  query: string;
  category: 'Temperature' | 'Salinity' | 'Float Status' | 'Climate Change';
  icon: string;
}
