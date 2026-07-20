"use client";

import React, { useState, useCallback, useMemo } from 'react';
import type { ChatMessage, MapPoint, GeminiResponse } from './types';
import { ChatPanel } from './components/ChatPanel';
import { LeafletMapModal } from './components/LeafletMapModal';
import { runQuery } from './services/geminiService';
import { SAMPLE_DATA } from './constants';
import { LogoIcon } from './components/icons/LogoIcon';
import { MapIcon } from './components/icons/MapIcon';

const App: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            sender: 'ai',
            text: `Welcome to FloatChat! I have data for ${SAMPLE_DATA.length} ARGO floats over a 3-year period. You can ask me to:
- 'Show all floats on the map'
- 'Plot temperature vs pressure for the latest profile of float ${SAMPLE_DATA[0].id}'
- 'Show me a histogram of surface temperatures for float ${SAMPLE_DATA[1].id}'
- 'What is the linear regression for temperature vs pressure for float ${SAMPLE_DATA[0].id}?'`
        }
    ]);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const allMapPoints = useMemo<MapPoint[]>(() => {
        return SAMPLE_DATA.map(float => {
            // Profiles are pre-sorted by date descending
            const latestProfile = float.profiles[0];
            const surfaceMeasurement = latestProfile.measurements[0];
            return {
                id: float.id,
                lat: float.latitude,
                lon: float.longitude,
                temperature: surfaceMeasurement.temperature,
                pressure: surfaceMeasurement.pressure,
            };
        });
    }, []);

    const handleSendMessage = useCallback(async (text: string) => {
        setIsLoading(true);
        setError(null);
        const newUserMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text };
        setMessages(prev => [...prev, newUserMessage]);

        try {
            const result: GeminiResponse = await runQuery(text, messages);

            const newAiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: "Here's what I found.",
            };

            switch (result.type) {
                case 'text':
                    newAiMessage.text = result.payload;
                    break;
                case 'action':
                     if (result.payload.action === 'show_map') {
                        setIsMapVisible(true);
                        newAiMessage.text = "Opening the map. You can view all floats and toggle between temperature and pressure overlays.";
                    }
                    break;
                case 'chart':
                    newAiMessage.text = `Here is the chart you requested: ${result.payload.title}.`;
                    newAiMessage.chartPayload = result.payload;
                    break;
                case 'equation':
                    newAiMessage.text = `Here is the mathematical model you requested: ${result.payload.title}.`;
                    newAiMessage.equationPayload = result.payload;
                    break;
                default:
                    newAiMessage.text = "Sorry, I couldn't process that request in the expected format.";
            }

            setMessages(prev => [...prev, newAiMessage]);

        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(errorMessage);
            const errorAiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: `Error: ${errorMessage}` };
            setMessages(prev => [...prev, errorAiMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    return (
        <div className="flex h-screen w-full bg-ocean-deep font-sans">
            <div className="flex flex-col w-full max-w-4xl mx-auto border-x border-ocean-light">
                <header className="p-4 border-b border-ocean-light flex items-center gap-3">
                    <LogoIcon className="h-8 w-8 text-accent-cyan" />
                    <h1 className="text-xl font-bold text-text-primary">FloatChat</h1>
                    <span className="text-xs text-text-secondary flex-grow">AI Ocean Data Explorer</span>
                     <button
                        onClick={() => setIsMapVisible(true)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors bg-ocean-light hover:bg-slate-600 text-text-primary"
                        aria-label="View World Map"
                    >
                        <MapIcon />
                        Map
                    </button>
                </header>
                <ChatPanel
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                />
            </div>
             <LeafletMapModal
                isOpen={isMapVisible}
                onClose={() => setIsMapVisible(false)}
                points={allMapPoints}
            />
        </div>
    );
};

export default App;