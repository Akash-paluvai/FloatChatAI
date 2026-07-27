import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Cpu, Database, Brain, LineChart, UserCheck, ShieldCheck, Zap, Network, Sparkles, CheckCircle2 } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';

export const ArchitectureSection: React.FC = () => {
  const nodes = [
    { title: 'Ocean Telemetry', sub: 'ARGO GDAC NetCDF & ERDDAP', icon: Waves, badge: 'Phase 3 ETL', color: 'from-[#00B4FF]/30 to-[#5EE6FF]/10' },
    { title: 'Spatial Engine', sub: 'PostgreSQL + PostGIS & Parquet', icon: Database, badge: 'Phase 4 DB', color: 'from-[#5EE6FF]/30 to-[#38BDF8]/10' },
    { title: 'Hybrid Retrieval', sub: 'BM25 + FAISS Vector Store', icon: Cpu, badge: 'Phase 5 Search', color: 'from-[#38BDF8]/30 to-[#00B4FF]/10' },
    { title: 'AI Intelligence', sub: 'LangGraph & MCP Tool Calling', icon: Brain, badge: 'Phase 6 AI', color: 'from-[#00B4FF]/30 to-[#06283D]' },
    { title: 'Multi-Agent Fleet', sub: 'Supervisor & 9 Worker Fleet', icon: Network, badge: 'Phase 7 Fleet', color: 'from-[#5EE6FF]/20 to-[#00B4FF]/10' },
    { title: 'Visual Report Studio', sub: 'Plotly 3D & Interactive Dashboard', icon: LineChart, badge: 'Phase 7 Studio', color: 'from-[#38BDF8]/30 to-[#5EE6FF]/10' },
  ];

  return (
    <section id="architecture" className="py-24 relative bg-[#021322] border-y border-[#5EE6FF]/10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-radial-ocean pointer-events-none opacity-40 blur-3xl" />

      <Container size="xl" className="relative z-10">
        <SectionTitle
          badgeText="Enterprise Multi-Agent Platform"
          title="FloatChat Distributed Architecture"
          subtitle="End-to-end data pipeline & multi-agent execution DAG built for sub-second query resolution and 100% grounded citations."
        />

        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-[#06283D]/70 border border-[#5EE6FF]/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative">
          
          {/* Top Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00B4FF]/20 border border-[#00B4FF]/40 flex items-center justify-center text-[#5EE6FF]">
                <Network className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-white">Distributed Multi-Agent System (Phases 1–7)</h3>
                <p className="text-xs text-[#A8C7D8] font-mono">10 Specialized Agents • PostGIS Engine • LangGraph Workflow DAG</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-mono">
              <CheckCircle2 className="w-4 h-4" /> All 7 Phases Verified & Live
            </div>
          </div>

          {/* 6 Grid Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nodes.map((node, idx) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${node.color} border border-[#5EE6FF]/20 hover:border-[#00B4FF] transition-all group relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-[#5EE6FF]" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#031B2E] border border-[#5EE6FF]/30 text-[#5EE6FF]">
                      {node.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-heading text-white group-hover:text-[#5EE6FF] transition-colors">
                    {node.title}
                  </h4>
                  <p className="text-xs text-[#A8C7D8] font-mono mt-1.5 leading-relaxed">
                    {node.sub}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Architecture Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-[#A8C7D8] gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              <span>Decoupled API Architecture — FastAPI REST, OpenAPI & WebSockets Compatible</span>
            </div>
            <span className="font-mono text-[11px] text-[#5EE6FF] bg-[#031B2E] px-3 py-1 rounded-full border border-[#5EE6FF]/20">
              ⚡ Sub-50ms DAG Execution Latency
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};
