/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServiceResponse } from '../types/service';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export interface SystemHealthData {
  status: string;
  app_name: string;
  version: string;
  environment: string;
  uptime_seconds: number;
  dependencies: Record<string, string>;
  latency_ms?: number;
  request_id?: string;
  total_observations?: number;
  total_files?: number;
}

export class SystemService {
  /**
   * Ping backend health endpoint and measure real round-trip latency
   */
  static async getHealth(): Promise<ServiceResponse<SystemHealthData>> {
    const startTime = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (res.ok) {
        const json = await res.json();
        const data: SystemHealthData = {
          ...json.data,
          latency_ms: latency,
          request_id: json.metadata?.request_id,
        };

        // Optionally fetch dashboard stats to include live observation count
        try {
          const dashRes = await fetch(`${API_BASE_URL}/dashboard/summary`);
          if (dashRes.ok) {
            const dashJson = await dashRes.json();
            data.total_observations = dashJson.data?.estimated_total_observations;
            data.total_files = dashJson.data?.total_parquet_files;
          }
        } catch {
          // ignore optional dashboard stats failure
        }

        return {
          data,
          success: true,
          isMockData: false,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.warn('Backend health check failed:', error);
    }

    // Fallback when server is unreachable
    return {
      data: {
        status: 'unreachable',
        app_name: 'FloatChat API',
        version: '1.0.0',
        environment: 'offline',
        uptime_seconds: 0,
        dependencies: {},
        latency_ms: 0,
        request_id: 'OFFLINE',
      },
      success: false,
      isMockData: true,
      timestamp: new Date().toISOString(),
    };
  }
}
