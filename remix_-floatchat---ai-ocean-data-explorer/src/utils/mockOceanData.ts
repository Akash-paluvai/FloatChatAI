import { ArgoFloat, ArgoProfile, ChatMessage } from '../types/ocean';

// Realistic ARGO Float Data from Bay of Bengal and Arabian Sea (2022-2024)
export const MOCK_ARGO_FLOATS: ArgoFloat[] = [
  {
    id: 'float-2902745',
    platformNumber: '2902745',
    institution: 'INCOIS (India)',
    status: 'Active',
    latitude: 14.25,
    longitude: 88.60,
    lastUpdate: '2024-03-15',
    profilesCount: 142,
    region: 'Bay of Bengal',
    profiles: Array.from({ length: 10 }, (_, i) => ({
      id: `prof-2902745-${i}`,
      floatId: 'float-2902745',
      platformNumber: '2902745',
      date: `2024-0${Math.floor(i / 3) + 1}-${10 + (i % 10)}`,
      latitude: 14.25 + i * 0.05,
      longitude: 88.60 + i * 0.08,
      region: 'Bay of Bengal',
      measurements: [
        { depth: 5, pressure: 5.1, temperature: 29.4 - i * 0.1, salinity: 33.2 + i * 0.05, oxygen: 210 },
        { depth: 25, pressure: 25.3, temperature: 28.9 - i * 0.12, salinity: 33.5 + i * 0.06, oxygen: 205 },
        { depth: 50, pressure: 50.6, temperature: 26.8 - i * 0.15, salinity: 34.1 + i * 0.07, oxygen: 180 },
        { depth: 100, pressure: 101.2, temperature: 22.1 - i * 0.18, salinity: 34.8 + i * 0.05, oxygen: 120 },
        { depth: 200, pressure: 202.5, temperature: 16.4 - i * 0.1, salinity: 35.1, oxygen: 65 },
        { depth: 500, pressure: 505.0, temperature: 10.2, salinity: 35.0, oxygen: 40 },
        { depth: 1000, pressure: 1010.4, temperature: 6.8, salinity: 34.9, oxygen: 75 },
        { depth: 1500, pressure: 1515.8, temperature: 4.2, salinity: 34.8, oxygen: 110 },
        { depth: 2000, pressure: 2021.0, temperature: 2.9, salinity: 34.7, oxygen: 135 },
      ]
    }))
  },
  {
    id: 'float-2903321',
    platformNumber: '2903321',
    institution: 'INCOIS (India)',
    status: 'Active',
    latitude: 18.70,
    longitude: 89.20,
    lastUpdate: '2024-03-18',
    profilesCount: 98,
    region: 'Bay of Bengal',
    profiles: Array.from({ length: 8 }, (_, i) => ({
      id: `prof-2903321-${i}`,
      floatId: 'float-2903321',
      platformNumber: '2903321',
      date: `2024-02-${12 + i}`,
      latitude: 18.70 + i * 0.04,
      longitude: 89.20 + i * 0.03,
      region: 'Bay of Bengal',
      measurements: [
        { depth: 5, pressure: 5.0, temperature: 28.8, salinity: 32.8, oxygen: 215 },
        { depth: 25, pressure: 25.2, temperature: 28.5, salinity: 33.1, oxygen: 208 },
        { depth: 50, pressure: 50.4, temperature: 25.9, salinity: 33.9, oxygen: 175 },
        { depth: 100, pressure: 100.8, temperature: 21.3, salinity: 34.6, oxygen: 110 },
        { depth: 200, pressure: 201.8, temperature: 15.8, salinity: 35.0, oxygen: 55 },
        { depth: 500, pressure: 504.2, temperature: 9.8, salinity: 34.95, oxygen: 38 },
        { depth: 1000, pressure: 1009.5, temperature: 6.4, salinity: 34.88, oxygen: 70 },
      ]
    }))
  },
  {
    id: 'float-1901789',
    platformNumber: '1901789',
    institution: 'NOAA (USA)',
    status: 'Active',
    latitude: 12.10,
    longitude: 65.40,
    lastUpdate: '2024-03-20',
    profilesCount: 215,
    region: 'Arabian Sea',
    profiles: Array.from({ length: 10 }, (_, i) => ({
      id: `prof-1901789-${i}`,
      floatId: 'float-1901789',
      platformNumber: '1901789',
      date: `2024-03-${1 + i}`,
      latitude: 12.10 + i * 0.06,
      longitude: 65.40 - i * 0.04,
      region: 'Arabian Sea',
      measurements: [
        { depth: 5, pressure: 5.1, temperature: 30.1, salinity: 36.4, oxygen: 195 },
        { depth: 25, pressure: 25.3, temperature: 29.8, salinity: 36.6, oxygen: 190 },
        { depth: 50, pressure: 50.5, temperature: 27.5, salinity: 36.8, oxygen: 145 },
        { depth: 100, pressure: 101.0, temperature: 23.2, salinity: 36.5, oxygen: 45 },
        { depth: 200, pressure: 202.1, temperature: 17.1, salinity: 35.9, oxygen: 18 },
        { depth: 500, pressure: 505.5, temperature: 11.4, salinity: 35.4, oxygen: 25 },
        { depth: 1000, pressure: 1012.0, temperature: 7.2, salinity: 35.1, oxygen: 60 },
      ]
    }))
  },
  {
    id: 'float-2901994',
    platformNumber: '2901994',
    institution: 'CSIRO (Australia)',
    status: 'Active',
    latitude: -5.40,
    longitude: 78.10,
    lastUpdate: '2024-03-12',
    profilesCount: 180,
    region: 'Indian Ocean',
    profiles: Array.from({ length: 8 }, (_, i) => ({
      id: `prof-2901994-${i}`,
      floatId: 'float-2901994',
      platformNumber: '2901994',
      date: `2024-01-${15 + i}`,
      latitude: -5.40 - i * 0.05,
      longitude: 78.10 + i * 0.04,
      region: 'Indian Ocean',
      measurements: [
        { depth: 5, pressure: 5.0, temperature: 28.2, salinity: 34.6, oxygen: 205 },
        { depth: 25, pressure: 25.1, temperature: 28.0, salinity: 34.6, oxygen: 202 },
        { depth: 50, pressure: 50.2, temperature: 26.4, salinity: 34.8, oxygen: 185 },
        { depth: 100, pressure: 100.5, temperature: 20.5, salinity: 35.1, oxygen: 150 },
        { depth: 200, pressure: 201.2, temperature: 14.8, salinity: 35.0, oxygen: 120 },
        { depth: 500, pressure: 503.8, temperature: 8.9, salinity: 34.7, oxygen: 95 },
        { depth: 1000, pressure: 1008.2, temperature: 5.1, salinity: 34.6, oxygen: 140 },
      ]
    }))
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    timestamp: 'Just now',
    text: "Welcome to FloatChat! I am your AI Oceanographic Copilot. You can ask me questions in natural language about ARGO float trajectories, temperature depth profiles, salinity anomalies, dissolved oxygen, or comparative ocean dynamics across the Bay of Bengal, Arabian Sea, and Indian Ocean.",
    confidenceScore: 0.99,
    sources: ['ARGO Global Data Assembly Centre (GDAC)', 'INCOIS Ocean Portal', 'NOAA NCEI']
  }
];

export const SAMPLE_PROMPT_SUGGESTIONS = [
  "Show temperature profiles near Bay of Bengal in early 2024.",
  "What happened to salinity in the Arabian Sea at 100m depth?",
  "Compare dissolved oxygen profiles between Arabian Sea and Bay of Bengal.",
  "Plot temperature vs salinity (T-S Diagram) for Float 2902745."
];
