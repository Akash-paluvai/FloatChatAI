import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, Code2, LineChart, MapPin, Database, Info, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { ChatService } from '../services/chat.service';
import { ChatMessage, PresetQuery } from '../types/chat';

export const DemoPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [presetQueries, setPresetQueries] = useState<PresetQuery[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      const historyRes = await ChatService.getHistory();
      const presetsRes = await ChatService.getPresetQueries();
      setMessages(historyRes.data);
      setPresetQueries(presetsRes.data);
    };
    initChat();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await ChatService.sendMessage(textToSend);
      setMessages((prev) => [...prev, response.data]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="Interactive AI Demo Preview">
      <div className="py-6 relative min-h-[85vh] flex flex-col">
        <Container size="xl" className="flex-1 flex flex-col gap-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#06283D]/60 border border-[#00B4FF]/30 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00B4FF]/20 border border-[#00B4FF]/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#5EE6FF]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold font-heading text-white">FloatChat AI Agent Interface</h1>
                  <Badge variant="phase2">Demo Preview</Badge>
                </div>
                <p className="text-xs text-[#A8C7D8]">
                  Phase 1 Mock Layer — Test natural language queries over 3,842 ARGO floats.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="accent" glowing icon={<Info className="w-3.5 h-3.5" />}>
                Phase 2 FastAPI Endpoint Simulated
              </Badge>
            </div>
          </div>

          {/* Chat Messages Log Area */}
          <div className="flex-1 rounded-3xl bg-[#031B2E]/90 border border-[#5EE6FF]/15 backdrop-blur-xl p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto min-h-[500px] max-h-[700px] shadow-2xl">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-xl bg-[#00B4FF] flex items-center justify-center shrink-0 shadow-lg shadow-[#00B4FF]/30 mt-1">
                      <Bot className="w-5 h-5 text-[#031B2E]" />
                    </div>
                  )}

                  <div className={`flex flex-col gap-3 max-w-3xl ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {/* Message Bubble Text */}
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#00B4FF] text-[#031B2E] font-medium rounded-tr-none shadow-lg'
                          : 'bg-[#06283D] text-white border border-[#5EE6FF]/20 rounded-tl-none shadow-xl'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span
                        className={`text-[10px] block mt-1 font-mono ${
                          msg.role === 'user' ? 'text-[#031B2E]/70 text-right' : 'text-[#A8C7D8]'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Assistant Artifact Cards (Chart, Map, SQL, Summary) */}
                    {msg.role === 'assistant' && msg.isDemoPreview && (
                      <div className="w-full flex flex-col gap-4 mt-2">
                        {/* Analytical Metrics Summary Grid */}
                        {msg.analyticalSummary && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/15">
                              <span className="text-[10px] font-mono text-[#A8C7D8] uppercase">Surface Temp</span>
                              <span className="text-sm font-bold text-white block mt-0.5">{msg.analyticalSummary.avgTemp}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/15">
                              <span className="text-[10px] font-mono text-[#A8C7D8] uppercase">Max Profile Depth</span>
                              <span className="text-sm font-bold text-[#5EE6FF] block mt-0.5">{msg.analyticalSummary.maxDepth}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/15">
                              <span className="text-[10px] font-mono text-[#A8C7D8] uppercase">Salinity Range</span>
                              <span className="text-sm font-bold text-white block mt-0.5">{msg.analyticalSummary.salinityRange}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/15">
                              <span className="text-[10px] font-mono text-[#A8C7D8] uppercase">Anomaly Filter</span>
                              <span className="text-sm font-bold text-emerald-400 block mt-0.5">Normal State</span>
                            </div>
                          </div>
                        )}

                        {/* Interactive Chart Placeholder */}
                        {msg.chartData && (
                          <Card variant="solid" hoverEffect={false} className="p-4 bg-[#031B2E]/90">
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#5EE6FF]/15">
                              <div className="flex items-center gap-2">
                                <LineChart className="w-4 h-4 text-[#00B4FF]" />
                                <span className="text-xs font-bold font-heading text-white">
                                  Temperature Profile vs. Depth (0m – 2000m)
                                </span>
                              </div>
                              <Badge variant="accent" size="sm">Plotly Mock</Badge>
                            </div>

                            {/* Depth Profile Visual Bar Representation */}
                            <div className="flex flex-col gap-2">
                              {msg.chartData.map((pt, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-mono">
                                  <span className="w-16 text-[#A8C7D8] text-right">{pt.depth}m</span>
                                  <div className="flex-1 bg-[#06283D] h-3 rounded-full overflow-hidden p-0.5">
                                    <div
                                      className="bg-gradient-to-r from-[#00B4FF] to-[#5EE6FF] h-full rounded-full transition-all"
                                      style={{ width: `${(pt.temperature / 30) * 100}%` }}
                                    />
                                  </div>
                                  <span className="w-14 text-white font-bold">{pt.temperature} °C</span>
                                </div>
                              ))}
                            </div>
                          </Card>
                        )}

                        {/* Map ARGO Points Placeholder */}
                        {msg.mapPoints && (
                          <Card variant="solid" hoverEffect={false} className="p-4 bg-[#031B2E]/90">
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#5EE6FF]/15">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#5EE6FF]" />
                                <span className="text-xs font-bold font-heading text-white">
                                  Active ARGO Floats in Bay of Bengal
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-[#A8C7D8]">{msg.mapPoints.length} Floats Located</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.mapPoints.map((fl) => (
                                <div key={fl.id} className="p-2.5 rounded-xl bg-[#06283D] border border-[#5EE6FF]/15 flex items-center justify-between">
                                  <div>
                                    <span className="text-xs font-mono font-bold text-white">WMO #{fl.wmoId}</span>
                                    <p className="text-[10px] text-[#A8C7D8] font-mono">{fl.latitude}°N, {fl.longitude}°E</p>
                                  </div>
                                  <Badge variant="success" size="sm">Active</Badge>
                                </div>
                              ))}
                            </div>
                          </Card>
                        )}

                        {/* SQL Query Translation Preview */}
                        {msg.sqlQuery && (
                          <div className="p-4 rounded-xl bg-[#031B2E] border border-purple-500/30">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold font-mono text-purple-300 flex items-center gap-1.5">
                                <Code2 className="w-4 h-4" /> Executed PostGIS SQL Query Preview
                              </span>
                              <Badge variant="phase2" size="sm">Text-to-SQL</Badge>
                            </div>
                            <pre className="text-xs font-mono text-[#5EE6FF] bg-[#06283D]/80 p-3 rounded-lg overflow-x-auto border border-[#5EE6FF]/10">
                              {msg.sqlQuery}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-[#06283D] border border-[#5EE6FF]/30 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-5 h-5 text-[#5EE6FF]" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#06283D] border border-[#5EE6FF]/20 w-fit">
                  <Spinner size="sm" />
                  <span className="text-xs font-mono text-[#A8C7D8] animate-pulse">
                    Translating natural language prompt to PostGIS SQL...
                  </span>
                </div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestion Chips & Input Controls */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-mono text-[#A8C7D8] shrink-0">Try Prompts:</span>
              {presetQueries.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSend(preset.query)}
                  className="px-3 py-1.5 rounded-full bg-[#06283D]/80 hover:bg-[#00B4FF]/20 border border-[#5EE6FF]/20 hover:border-[#00B4FF]/50 text-xs text-white/90 whitespace-nowrap transition-all shrink-0"
                >
                  {preset.query}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-3 p-2 rounded-2xl bg-[#06283D] border border-[#5EE6FF]/30 focus-within:border-[#00B4FF] shadow-2xl transition-all"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask FloatChat about ARGO ocean temperature, salinity, or floats..."
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-[#A8C7D8]/50 focus:outline-none"
              />
              <Button
                type="submit"
                variant="gradient"
                size="md"
                isLoading={isLoading}
                disabled={!inputQuery.trim()}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Query
              </Button>
            </form>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};
