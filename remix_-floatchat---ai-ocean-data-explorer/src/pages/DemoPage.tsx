import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_CHAT_MESSAGES, SAMPLE_PROMPT_SUGGESTIONS } from '../utils/mockOceanData';
import { processUserQuery } from '../utils/queryGenerator';
import { ChatMessage } from '../types/ocean';
import { LeafletOceanMap } from '../components/interactive/LeafletOceanMap';
import { 
  Send, Sparkles, User, Bot, Database, Code, CheckCircle2, 
  FileDown, Plus, MessageSquare, Compass, RefreshCw, ChevronRight, Layers, ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const DemoPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTabMapSql, setActiveTabMapSql] = useState<Record<string, 'map' | 'sql' | 'chart'>>({});

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isStreaming) return;

    // Append User Message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsStreaming(true);

    // Simulate AI Streaming Response Delay
    setTimeout(() => {
      const aiMsg = processUserQuery(query);
      setMessages(prev => [...prev, aiMsg]);
      setIsStreaming(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-24 pb-10 bg-[#031B2E] text-white flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar: Suggested Queries & Recent History */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            
            {/* New Chat Button */}
            <button
              onClick={() => setMessages(INITIAL_CHAT_MESSAGES)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00B4FF]/20 to-[#5EE6FF]/10 border border-[#5EE6FF]/30 text-[#5EE6FF] font-heading font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#00B4FF]/30 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Exploration Session</span>
            </button>

            {/* Prompt Suggestions */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-[#A8C7D8] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#5EE6FF]" /> Suggested Questions
              </span>
              <div className="space-y-2">
                {SAMPLE_PROMPT_SUGGESTIONS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="w-full text-left p-3 rounded-xl bg-[#06283D]/60 border border-white/10 hover:border-[#5EE6FF]/40 text-xs text-[#A8C7D8] hover:text-white transition-all duration-200 flex items-center justify-between group"
                  >
                    <span className="line-clamp-2">{prompt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#5EE6FF] group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Session Info */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono text-[#A8C7D8]">
              <div className="flex items-center justify-between">
                <span>Model Engine:</span>
                <span className="text-[#5EE6FF]">GPT-4o + MCP</span>
              </div>
              <div className="flex items-center justify-between">
                <span>RAG Vector DB:</span>
                <span className="text-[#5EE6FF]">ChromaDB #BOB-2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Region:</span>
                <span className="text-white">Indian Ocean / BoB</span>
              </div>
            </div>

          </div>
        </aside>

        {/* Main Chat Interface */}
        <main className="lg:col-span-8 flex flex-col h-[750px] rounded-3xl bg-[#06283D]/50 border border-[#5EE6FF]/20 backdrop-blur-2xl shadow-2xl overflow-hidden">
          
          {/* Top Chat Header */}
          <div className="bg-[#031B2E] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00B4FF]/20 border border-[#5EE6FF]/30 flex items-center justify-center text-[#5EE6FF]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-white">FloatChat Scientific Assistant</h3>
                <span className="text-[10px] font-mono text-[#A8C7D8]">Natural Language Ocean Data Discovery</span>
              </div>
            </div>
            
            <button 
              onClick={() => setMessages(INITIAL_CHAT_MESSAGES)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A8C7D8] hover:text-white transition-colors"
              title="Reset Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-4 items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00B4FF] to-[#06283D] border border-[#5EE6FF]/40 flex items-center justify-center text-[#5EE6FF] shrink-0 shadow-md">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className={`space-y-4 max-w-xl w-full ${msg.sender === 'user' ? 'max-w-md' : ''}`}>
                    
                    {/* Message Bubble */}
                    <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#00B4FF]/30 to-[#38BDF8]/20 border border-[#5EE6FF]/40 text-white self-end'
                        : 'glass-panel border border-white/10 text-[#A8C7D8]'
                    }`}>
                      <p className="text-white font-light">{msg.text}</p>

                      {/* Confidence & Sources Footer for AI */}
                      {msg.confidenceScore && (
                        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-[#A8C7D8]">
                          <span className="flex items-center gap-1 text-[#22C55E]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {(msg.confidenceScore * 100).toFixed(0)}% Confidence
                          </span>
                          {msg.sources && (
                            <span className="truncate max-w-[200px] text-[10px] text-[#5EE6FF]">
                              Sources: {msg.sources.join(', ')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Interactive Tab Visualizers (Map / Chart / SQL) */}
                    {(msg.mapData || msg.chartData || msg.generatedSql) && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                          {msg.mapData && (
                            <button
                              onClick={() => setActiveTabMapSql(prev => ({ ...prev, [msg.id]: 'map' }))}
                              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                                (activeTabMapSql[msg.id] || 'map') === 'map'
                                  ? 'bg-[#00B4FF] text-[#031B2E] font-bold shadow'
                                  : 'text-[#A8C7D8] bg-white/5 hover:text-white'
                              }`}
                            >
                              Map Layer
                            </button>
                          )}
                          {msg.chartData && (
                            <button
                              onClick={() => setActiveTabMapSql(prev => ({ ...prev, [msg.id]: 'chart' }))}
                              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                                activeTabMapSql[msg.id] === 'chart' || (!msg.mapData && activeTabMapSql[msg.id] !== 'sql')
                                  ? 'bg-[#00B4FF] text-[#031B2E] font-bold shadow'
                                  : 'text-[#A8C7D8] bg-white/5 hover:text-white'
                              }`}
                            >
                              Depth Chart
                            </button>
                          )}
                          {msg.generatedSql && (
                            <button
                              onClick={() => setActiveTabMapSql(prev => ({ ...prev, [msg.id]: 'sql' }))}
                              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                                activeTabMapSql[msg.id] === 'sql'
                                  ? 'bg-[#00B4FF] text-[#031B2E] font-bold shadow'
                                  : 'text-[#A8C7D8] bg-white/5 hover:text-white'
                              }`}
                            >
                              PostGIS SQL
                            </button>
                          )}
                        </div>

                        {/* Map View */}
                        {(activeTabMapSql[msg.id] || 'map') === 'map' && msg.mapData && (
                          <LeafletOceanMap
                            points={msg.mapData.points}
                            center={msg.mapData.center}
                            zoom={msg.mapData.zoom}
                            height="240px"
                            title={msg.mapData.title}
                          />
                        )}

                        {/* Chart View */}
                        {(activeTabMapSql[msg.id] === 'chart' || (!msg.mapData && activeTabMapSql[msg.id] !== 'sql')) && msg.chartData && (
                          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
                            <span className="font-heading font-semibold text-xs text-white block">{msg.chartData.title}</span>
                            <div className="h-52 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={msg.chartData.data}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                  <XAxis dataKey="depth" stroke="#A8C7D8" fontSize={10} label={{ value: msg.chartData.xAxisLabel, position: 'insideBottom', offset: -5, fill: '#A8C7D8', fontSize: 10 }} />
                                  <YAxis stroke="#A8C7D8" fontSize={10} reversed label={{ value: msg.chartData.yAxisLabel, angle: -90, position: 'insideLeft', fill: '#A8C7D8', fontSize: 10 }} />
                                  <Tooltip contentStyle={{ background: '#031B2E', border: '1px solid #5EE6FF', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                                  <Line type="monotone" dataKey="temp" name="Bay of Bengal (°C)" stroke="#5EE6FF" strokeWidth={2} dot={{ r: 3 }} />
                                  <Line type="monotone" dataKey="tempArabian" name="Arabian Sea (°C)" stroke="#00B4FF" strokeWidth={2} dot={{ r: 3 }} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}

                        {/* SQL View */}
                        {activeTabMapSql[msg.id] === 'sql' && msg.generatedSql && (
                          <div className="bg-[#020d18] p-4 rounded-2xl border border-white/10 font-mono text-xs text-[#5EE6FF] overflow-x-auto">
                            <pre>{msg.generatedSql}</pre>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-[#00B4FF] flex items-center justify-center text-[#031B2E] font-bold text-xs shrink-0 shadow-md">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isStreaming && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-center text-xs font-mono text-[#5EE6FF]">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing PostGIS SQL & RAG embeddings...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Prompt Area */}
          <div className="p-4 bg-[#031B2E] border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-3 relative"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask FloatChat... (e.g. 'Show temperature profiles in Bay of Bengal')"
                className="w-full py-3.5 pl-4 pr-12 rounded-2xl bg-[#06283D] border border-[#5EE6FF]/30 text-white placeholder-[#A8C7D8]/60 text-sm focus:outline-none focus:border-[#5EE6FF] focus:shadow-[0_0_20px_rgba(94,230,255,0.3)] transition-all"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isStreaming}
                className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-[#00B4FF] to-[#38BDF8] text-[#031B2E] hover:shadow-[0_0_15px_rgba(94,230,255,0.6)] disabled:opacity-50 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </main>

      </div>
    </div>
  );
};
