export const ENV = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.floatchat.ai/v1', // Phase 2 FastAPI endpoint placeholder
  useMockData: true, // Phase 1 flag: always use clean typed mock layer
  enableAnalytics: false,
} as const;
