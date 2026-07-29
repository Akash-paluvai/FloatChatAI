import { ChatMessage, PresetQuery } from '../types/chat';

export const MOCK_PRESET_QUERIES: PresetQuery[] = [
  { id: '1', query: 'Show temperature near Bay of Bengal', category: 'Temperature', icon: '🌡️' },
  { id: '2', query: 'Find salinity in Arabian Sea', category: 'Salinity', icon: '🧂' },
  { id: '3', query: 'List active ARGO floats in Indian Ocean', category: 'Float Status', icon: '🛰️' },
  { id: '4', query: 'Compare 2022 vs 2024 surface ocean heat', category: 'Climate Change', icon: '📊' },
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: 'Welcome to FloatChat! Ask me about ocean temperature, salinity, or ARGO float data.',
    timestamp: '10:00 AM',
  },
];
