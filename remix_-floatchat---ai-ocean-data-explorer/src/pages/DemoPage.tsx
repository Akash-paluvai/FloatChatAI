import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, Code2, LineChart, BarChart3, Activity, Waves, Database, ChevronRight } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { ChatService } from '../services/chat.service';
import { ChatMessage, PresetQuery, PlotlyChartSpec, AnalyticsSummary } from '../types/chat';

/* Lazy-load Plotly to avoid bundle bloat */
const Plot = lazy(() => import('react-plotly.js'));

/** Dark-themed Plotly layout overrides */
const DARK_LAYOUT: Record<string, unknown> = {
  paper_bgcolor: 'rgba(3,27,46,0.95)',
  plot_bgcolor: 'rgba(6,40,61,0.9)',
  font: { color: '#A8C7D8', family: 'Inter, sans-serif', size: 11 },
  margin: { t: 40, r: 20, b: 50, l: 60 },
  xaxis: { gridcolor: 'rgba(94,230,255,0.08)', zerolinecolor: 'rgba(94,230,255,0.12)' },
  yaxis: { gridcolor: 'rgba(94,230,255,0.08)', zerolinecolor: 'rgba(94,230,255,0.12)' },
  colorway: ['#00B4FF', '#5EE6FF', '#38BDF8', '#818CF8', '#F472B6', '#34D399'],
};

/** Chart type icon mapping */
const chartIcon = (type: string) => {
  switch (type) {
    case 'depth_profile': return <Activity className="w-4 h-4 text-[#00B4FF]" />;
    case 'ts_diagram': return <Waves className="w-4 h-4 text-[#5EE6FF]" />;
    case 'histogram': return <BarChart3 className="w-4 h-4 text-[#38BDF8]" />;
    default: return <LineChart className="w-4 h-4 text-[#00B4FF]" />;
  }
};

/** Renders a single Plotly chart */
const PlotlyChart: React.FC<{ spec: PlotlyChartSpec }> = ({ spec }) => (
  <Card variant="solid" hoverEffect={false} className="p-3 bg-[#031B2E]/95 border border-[#5EE6FF]/15">
    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#5EE6FF]/10">
      <div className="flex items-center gap-2">
        {chartIcon(spec.type)}
        <span className="text-xs font-bold font-heading text-white truncate">{spec.title}</span>
      </div>
      <Badge variant="accent" size="sm">{spec.type.replace(/_/g, ' ')}</Badge>
    </div>
    <Suspense fallback={<div className="h-64 flex items-center justify-center"><Spinner size="md" /></div>}>
      <Plot
        data={spec.config.data}
        layout={{ ...DARK_LAYOUT, ...spec.config.layout, autosize: true }}
        config={{ responsive: true, displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'] }}
        useResizeHandler
        style={{ width: '100%', height: 320 }}
      />
    </Suspense>
  </Card>
);

/** Renders analytics stats grid */
const AnalyticsGrid: React.FC<{ analytics: AnalyticsSummary }> = ({ analytics }) => {
  const items: { label: string; value: string; color?: string }[] = [];

  if (analytics.total_observations != null) items.push({ label: 'Observations', value: analytics.total_observations.toLocaleString() });
  if (analytics.avg_temp) items.push({ label: 'Mean Temp', value: analytics.avg_temp, color: 'text-[#00B4FF]' });
  if (analytics.avg_salinity || analytics.mean_salinity) items.push({ label: 'Mean Salinity', value: analytics.avg_salinity || analytics.mean_salinity || '', color: 'text-[#38BDF8]' });
  if (analytics.salinity_range) items.push({ label: 'Salinity Range', value: analytics.salinity_range });
  if (analytics.depth_range) items.push({ label: 'Depth Range', value: analytics.depth_range });
  if (analytics.time_range) items.push({ label: 'Time Period', value: analytics.time_range });
  if (analytics.spatial_centroid) items.push({ label: 'Centroid', value: analytics.spatial_centroid });
  if (analytics.thermocline_gradient_depth) items.push({ label: 'Thermocline', value: analytics.thermocline_gradient_depth, color: 'text-emerald-400' });
  if (analytics.unique_profiles) items.push({ label: 'Float Profiles', value: String(analytics.unique_profiles) });
  if (analytics.regime) items.push({ label: 'Regime', value: analytics.regime, color: 'text-amber-400' });
  if (analytics.overall_delta) items.push({ label: 'Change', value: analytics.overall_delta, color: analytics.trend_direction === 'Warming' ? 'text-red-400' : 'text-cyan-400' });
  if (analytics.trend_direction) items.push({ label: 'Trend', value: analytics.trend_direction });

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {items.map((item, i) => (
        <div key={i} className="p-2.5 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/12">
          <span className="text-[9px] font-mono text-[#A8C7D8] uppercase tracking-wider">{item.label}</span>
          <span className={`text-sm font-bold block mt-0.5 ${item.color || 'text-white'}`}>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

/** Simple markdown-like renderer for response text */
const RichText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        // Headings
        if (line.startsWith('### ')) {
          return <h4 key={i} className="text-xs font-bold text-[#5EE6FF] uppercase tracking-wide mt-2 mb-1">{line.slice(4)}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={i} className="text-sm font-bold text-white mt-2 mb-1">{line.slice(3)}</h3>;
        }
        // Bold **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
            : <span key={j}>{part}</span>
        );
        if (line.startsWith('- ')) {
          return <div key={i} className="flex gap-2 text-sm leading-relaxed pl-1"><span className="text-[#5EE6FF] shrink-0">•</span><span className="flex-1">{parts.slice(0)}</span></div>;
        }
        return <p key={i} className="text-sm leading-relaxed">{parts}</p>;
      })}
    </div>
  );
};


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
    <MainLayout title="FloatChat AI — Ocean Data Explorer">
      <div className="py-4 relative min-h-[85vh] flex flex-col">
        <Container size="xl" className="flex-1 flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#06283D]/60 border border-[#00B4FF]/30 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00B4FF]/20 border border-[#00B4FF]/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#5EE6FF]" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-heading text-white">FloatChat AI Explorer</h1>
                <p className="text-[11px] text-[#A8C7D8]">
                  Real-time analysis of 36 months × ~1.5M ARGO float observations per month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" glowing icon={<Database className="w-3 h-3" />}>Live Parquet Data</Badge>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 rounded-3xl bg-[#031B2E]/90 border border-[#5EE6FF]/15 backdrop-blur-xl p-4 sm:p-5 flex flex-col gap-5 overflow-y-auto min-h-[500px] max-h-[75vh] shadow-2xl">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-[#00B4FF] flex items-center justify-center shrink-0 shadow-lg shadow-[#00B4FF]/30 mt-1">
                      <Bot className="w-4 h-4 text-[#031B2E]" />
                    </div>
                  )}

                  <div className={`flex flex-col gap-3 ${msg.role === 'user' ? 'max-w-lg items-end' : 'max-w-4xl items-start'}`}>
                    {/* Message Text */}
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#00B4FF] text-[#031B2E] font-medium rounded-tr-none shadow-lg'
                          : 'bg-[#06283D] text-[#D1E4ED] border border-[#5EE6FF]/15 rounded-tl-none shadow-xl'
                      }`}
                    >
                      {msg.role === 'assistant' ? <RichText text={msg.content} /> : <p>{msg.content}</p>}
                      <span className={`text-[9px] block mt-1.5 font-mono ${msg.role === 'user' ? 'text-[#031B2E]/60 text-right' : 'text-[#A8C7D8]/60'}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Analytics Grid */}
                    {msg.role === 'assistant' && msg.analytics && Object.keys(msg.analytics).length > 1 && (
                      <AnalyticsGrid analytics={msg.analytics} />
                    )}

                    {/* Charts */}
                    {msg.role === 'assistant' && msg.charts && msg.charts.length > 0 && (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {msg.charts.map((chart, idx) => (
                          <PlotlyChart key={idx} spec={chart} />
                        ))}
                      </div>
                    )}

                    {/* SQL Preview */}
                    {msg.role === 'assistant' && msg.sqlQuery && (
                      <div className="w-full p-3 rounded-xl bg-[#031B2E] border border-purple-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold font-mono text-purple-300 flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5" /> PostGIS SQL Query
                          </span>
                          <Badge variant="phase2" size="sm">SQL</Badge>
                        </div>
                        <pre className="text-[11px] font-mono text-[#5EE6FF]/80 bg-[#06283D]/60 p-2.5 rounded-lg overflow-x-auto border border-[#5EE6FF]/8">
                          {msg.sqlQuery}
                        </pre>
                      </div>
                    )}

                    {/* Follow-up Suggestions */}
                    {msg.role === 'assistant' && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowups.map((fu, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(fu)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#06283D]/70 hover:bg-[#00B4FF]/15 border border-[#5EE6FF]/15 hover:border-[#00B4FF]/40 text-[11px] text-[#A8C7D8] hover:text-white transition-all"
                          >
                            <ChevronRight className="w-3 h-3" /> {fu}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-[#06283D] border border-[#5EE6FF]/30 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-[#5EE6FF]" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#06283D] border border-[#5EE6FF]/20 w-fit"
                >
                  <Spinner size="sm" />
                  <span className="text-xs font-mono text-[#A8C7D8] animate-pulse">
                    Loading real ARGO observations from parquet files...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Quick Presets & Input */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-mono text-[#A8C7D8] shrink-0">Try:</span>
              {presetQueries.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSend(preset.query)}
                  className="px-3 py-1.5 rounded-full bg-[#06283D]/80 hover:bg-[#00B4FF]/20 border border-[#5EE6FF]/15 hover:border-[#00B4FF]/50 text-[11px] text-white/80 whitespace-nowrap transition-all shrink-0"
                >
                  {preset.icon} {preset.query}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-3 p-2 rounded-2xl bg-[#06283D] border border-[#5EE6FF]/25 focus-within:border-[#00B4FF] shadow-2xl transition-all"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about ocean temperature, salinity, depth profiles, or ARGO floats..."
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-[#A8C7D8]/40 focus:outline-none"
              />
              <Button
                type="submit"
                variant="gradient"
                size="md"
                isLoading={isLoading}
                disabled={!inputQuery.trim()}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Query
              </Button>
            </form>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};
