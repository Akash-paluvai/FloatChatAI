"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons/SendIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { ChartDisplay } from './ChartDisplay';
import { EquationDisplay } from './EquationDisplay';

interface ChatPanelProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading }) => {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim() && !isLoading) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-ocean-mid">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-ocean-light flex items-center justify-center flex-shrink-0">
                                <span className="text-accent-cyan text-sm font-bold">AI</span>
                            </div>
                        )}
                        <div
                            className={`max-w-xl p-3 rounded-lg ${
                                msg.sender === 'user'
                                    ? 'bg-accent-cyan text-ocean-deep'
                                    : 'bg-ocean-light text-text-primary'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            {msg.chartPayload && (
                                <div className="mt-3 bg-ocean-deep p-2 rounded-md h-64">
                                    <ChartDisplay payload={msg.chartPayload} />
                                </div>
                            )}
                            {msg.equationPayload && (
                                <div className="mt-3 bg-ocean-deep p-2 rounded-md">
                                    <EquationDisplay payload={msg.equationPayload} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                         <div className="w-8 h-8 rounded-full bg-ocean-light flex items-center justify-center flex-shrink-0">
                            <span className="text-accent-cyan text-sm font-bold">AI</span>
                        </div>
                        <div className="max-w-md p-3 rounded-lg bg-ocean-light flex items-center space-x-2">
                           <LoadingSpinner />
                           <span className="text-text-secondary text-sm">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-ocean-light">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Ask about ARGO data..."
                        className="flex-1 bg-ocean-light border border-slate-700 rounded-lg p-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputText.trim()}
                        className="bg-accent-cyan text-ocean-deep p-2 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-accent-light transition-colors"
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};