export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    chartPayload?: ChartPayload;
    equationPayload?: EquationPayload;
}

export interface ArgoMeasurement {
    pressure: number;
    temperature: number;
    salinity: number;
}

export interface ArgoProfile {
    date: string;
    measurements: ArgoMeasurement[];
}

export interface ArgoDataPoint {
    id: string;
    latitude: number;
    longitude: number;
    profiles: ArgoProfile[];
}

export interface MapPoint {
    id: string;
    lat: number;
    lon: number;
    temperature: number;
    pressure: number;
}

export interface ChartConfig {
    xAxisKey: string;
    yAxisKey: string;
    chartType: 'line' | 'bar';
    annotations?: any[]; // Allow annotations for regression lines
}

export interface ChartPayload {
    title: string;
    data: any[];
    config: ChartConfig;
}

export interface EquationPayload {
    title:string;
    equation: string;
    explanation: string;
    chartPayload: ChartPayload;
}

export type GeminiResponse =
    | { type: 'text'; payload: string }
    | { type: 'chart'; payload: ChartPayload }
    | { type: 'action'; payload: { action: 'show_map' } }
    | { type: 'equation'; payload: EquationPayload };