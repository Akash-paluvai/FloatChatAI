import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Cpu, Database, Brain, LineChart, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';

export const ArchitectureSection: React.FC = () => {
  const nodes = [
    { title: 'Ocean Data', sub: 'ARGO Telemetry & netCDF', icon: Waves, badge: 'Input' },
    { title: 'Processing Pipeline', sub: 'Python & FastAPI Parser', icon: Cpu, badge: 'ETL' },
    { title: 'Database Storage', sub: 'PostgreSQL + PostGIS & Parquet', icon: Database, badge: 'Persistence' },
    { title: 'AI Layer', sub: 'LangChain Text-to-SQL RAG', icon: Brain, badge: 'Intelligence' },
    { title: 'Visualization Engine', sub: 'Plotly 3D & Leaflet Maps', icon: LineChart, badge: 'Rendering' },
    { title: 'User Interface', sub: 'React 19 + FloatChat SaaS', icon: UserCheck, badge: 'Client' },
  ];

  return (
    <section id="architecture" className="py-20 relative bg-[#031B2E]/40 border-y border-[#5EE6FF]/10">
      <Container size="xl">
        <SectionTitle
          badgeText="System Design"
          title="Architecture Preview"
          subtitle="End-to-end data flow designed for sub-second oceanographic query resolution."
        />

        <div className="mt-14 p-6 sm:p-10 rounded-3xl bg-[#06283D]/60 border border-[#5EE6FF]/20 backdrop-blur-xl shadow-2xl relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {nodes.map((node, idx) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#031B2E]/80 border border-[#5EE6FF]/15 hover:border-[#00B4FF] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00B4FF]/15 border border-[#00B4FF]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-[#5EE6FF]" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#5EE6FF] transition-colors">
                        {node.title}
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#06283D] text-[#A8C7D8]">
                        {node.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#A8C7D8] font-mono mt-1">{node.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-[#5EE6FF]/15 flex items-center justify-between text-xs text-[#A8C7D8]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Decoupled API Architecture — Ready for Phase 2 FastAPI Integration</span>
            </div>
            <span className="font-mono text-[11px] hidden sm:inline">JSON REST & WebSockets Compatible</span>
          </div>
        </div>
      </Container>
    </section>
  );
};
