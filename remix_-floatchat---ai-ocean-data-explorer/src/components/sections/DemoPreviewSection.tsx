import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LeafletOceanMap } from '../interactive/LeafletOceanMap';
import { MOCK_ARGO_FLOATS } from '../../utils/mockOceanData';
import { Sparkles, Database, CheckCircle2, FileText, ArrowRight, User, Bot, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemoPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'sql' | 'chart'>('map');

  const bayOfBengalPoints = MOCK_ARGO_FLOATS.filter(f => f.region === 'Bay of Bengal').map(f => ({
    id: f.id,
    lat: f.latitude,
    lon: f.longitude,
    temp: f.profiles[0].measurements[0].temperature,
    salinity: f.profiles[0].measurements[0].salinity,
    floatId: f.platformNumber
  }));

  return (
    <section className="py-24 bg-[#031B2E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06283D] border border-[#5EE6FF]/30 text-[#5EE6FF] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Live Interface Preview
          </div>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            Conversational Intelligence <span className="gradient-ocean-text">In Action</span>
          </h2>
          <p className="text-[#A8C7D8] text-base font-light">
            Ask any question. FloatChat queries PostGIS, analyzes depth profiles, and synthesizes publication-grade visuals.
          </p>
        </div>

        {/* ChatGPT Style Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#06283D]/70 border border-[#5EE6FF]/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          
          {/* Top Window Bar */}
          <div className="bg-[#031B2E] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 font-mono text-xs text-[#A8C7D8]">floatchat-copilot-v2.4</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#5EE6FF]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              Connected to INCOIS PostGIS DB
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-6 space-y-6">
            
            {/* User Message */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-4 items-start justify-end"
            >
              <div className="bg-gradient-to-r from-[#00B4FF]/30 to-[#38BDF8]/20 border border-[#5EE6FF]/40 rounded-2xl p-4 max-w-lg text-sm text-white shadow-lg">
                "Show temperature profiles in Bay of Bengal for early 2024."
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#00B4FF] flex items-center justify-center text-[#031B2E] font-bold text-xs shrink-0 shadow-md">
                <User className="w-5 h-5" />
              </div>
            </motion.div>

            {/* AI Assistant Message */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 items-start"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00B4FF] to-[#06283D] border border-[#5EE6FF]/50 flex items-center justify-center text-[#5EE6FF] shrink-0 shadow-lg">
                <Bot className="w-5 h-5" />
              </div>

              <div className="space-y-4 max-w-2xl w-full">
                
                {/* Text Explanation */}
                <div className="glass-panel rounded-2xl p-5 border border-white/10 text-sm text-[#A8C7D8] leading-relaxed space-y-3">
                  <p className="text-white font-medium">
                    Synthesized <span className="text-[#5EE6FF] font-mono">142 ARGO float profiles</span> across the Bay of Bengal region (80°E–95°E, 10°N–22°N).
                  </p>
                  <p className="text-xs">
                    The upper mixed layer maintains warm sea surface temperatures of 28.5°C to 29.4°C. A sharp thermocline is detected between 50m and 200m depth, dropping temperature by ~12.5°C.
                  </p>

                  {/* Confidence Badge & RAG Sources */}
                  <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-white/10 text-xs">
                    <span className="flex items-center gap-1 text-[#22C55E] font-mono bg-[#22C55E]/10 px-2.5 py-0.5 rounded-full border border-[#22C55E]/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 96% Confidence
                    </span>
                    <span className="text-[11px] text-[#A8C7D8] flex items-center gap-1 font-mono">
                      <FileText className="w-3 h-3 text-[#00B4FF]" /> Source: INCOIS ARGO NetCDF DB v3.4
                    </span>
                  </div>
                </div>

                {/* Response Visual Tabs */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <button
                      onClick={() => setActiveTab('map')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        activeTab === 'map'
                          ? 'bg-[#00B4FF] text-[#031B2E] font-bold shadow-md'
                          : 'text-[#A8C7D8] hover:text-white bg-white/5'
                      }`}
                    >
                      Interactive Map
                    </button>
                    <button
                      onClick={() => setActiveTab('sql')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        activeTab === 'sql'
                          ? 'bg-[#00B4FF] text-[#031B2E] font-bold shadow-md'
                          : 'text-[#A8C7D8] hover:text-white bg-white/5'
                      }`}
                    >
                      Generated PostGIS SQL
                    </button>
                  </div>

                  {activeTab === 'map' ? (
                    <LeafletOceanMap
                      points={bayOfBengalPoints}
                      center={[16.5, 88.8]}
                      zoom={6}
                      height="260px"
                      title="Bay of Bengal Trajectories & Profiles"
                    />
                  ) : (
                    <div className="bg-[#020d18] p-4 rounded-2xl border border-white/10 font-mono text-xs text-[#5EE6FF] overflow-x-auto">
                      <pre>{`SELECT f.platform_number, p.latitude, p.longitude, m.depth_m, m.temperature_c
FROM argo_profiles p
JOIN argo_floats f ON p.float_id = f.id
JOIN argo_measurements m ON m.profile_id = p.id
WHERE ST_Contains(ST_MakeEnvelope(80.0, 10.0, 95.0, 22.0, 4326), 
                  ST_SetSRID(ST_MakePoint(p.longitude, p.latitude), 4326))
  AND p.juld >= '2024-01-01'
ORDER BY m.depth_m ASC;`}</pre>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>

          </div>

          {/* Bottom Action Footer */}
          <div className="bg-[#031B2E] p-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-[#A8C7D8] font-mono hidden sm:inline">
              Try asking your own question in the live demo!
            </span>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#00B4FF] to-[#38BDF8] text-[#031B2E] font-heading font-bold text-xs shadow-md hover:shadow-[0_0_20px_rgba(94,230,255,0.6)] transition-all"
            >
              <span>Launch Full AI Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
