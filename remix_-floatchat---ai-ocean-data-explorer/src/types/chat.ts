/* eslint-disable @typescript-eslint/no-explicit-any */

export type MessageRole = 'user' | 'assistant' | 'system';

/** Plotly chart specification returned by the backend */
export interface PlotlyChartSpec {
  type: string;        // 'depth_profile' | 'spatial_scatter' | 'ts_diagram' | 'timeseries' | 'histogram' | 'multi_year_overlay' | 'trajectory_map'
  title: string;
  config: {
    data: any[];
    layout: Record<string, any>;
  };
}

/** Analytics summary from real data */
export interface AnalyticsSummary {
  region_name?: string;
  total_observations?: number;
  avg_temp?: string;
  min_temp?: string;
  max_temp?: string;
  std_temp?: string;
  salinity_range?: string;
  avg_salinity?: string;
  depth_range?: string;
  time_range?: string;
  spatial_centroid?: string;
  thermocline_gradient_depth?: string;
  unique_profiles?: number;
  cited_source_files?: string[];
  // Comparison fields
  years_compared?: number[];
  variable?: string;
  yearly_summaries?: Record<number, {
    mean_val: number | null;
    std_val?: number;
    min_val?: number;
    max_val?: number;
    obs_count: number;
    note?: string;
  }>;
  overall_delta?: string;
  trend_direction?: string;
  // Salinity fields
  mean_salinity?: string;
  std_salinity?: string;
  regime?: string;
  mean_temp?: string;
  ts_correlation?: string;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isDemoPreview?: boolean;
  sqlQuery?: string;
  /** Array of Plotly chart specs from real data */
  charts?: PlotlyChartSpec[];
  /** Real analytics summary */
  analytics?: AnalyticsSummary;
  suggestedFollowups?: string[];
  /** Data table sample */
  dataTable?: {
    n_rows: number;
    columns: string[];
    sample_rows: Record<string, any>[];
  };
  // Legacy fields for backward compatibility
  chartData?: any;
  mapPoints?: any;
  analyticalSummary?: any;
  artifacts?: any;
}

export interface PresetQuery {
  id: string;
  query: string;
  category: 'Temperature' | 'Salinity' | 'Float Status' | 'Climate Change';
  icon: string;
}
