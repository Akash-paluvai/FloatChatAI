import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { CheckCircle2, Clock, Zap, ArrowUpRight } from 'lucide-react';

export const RoadmapSection: React.FC = () => {
  const phases = [
    { phase: 'Phase 1', title: 'Production React Frontend', status: 'Completed', detail: 'React 19, TypeScript, Vite, Framer Motion & Tailwind UI Design System' },
    { phase: 'Phase 2', title: 'Enterprise FastAPI Backend', status: 'Completed', detail: 'Versioned REST API, Pydantic v2, Loguru, SQLAlchemy 2.x async & Alembic' },
    { phase: 'Phase 3', title: 'Ocean Data Engineering ETL', status: 'Completed', detail: 'ARGO GDAC NetCDF/CSV extractors, ARGO QC flag engine (1-4) & Parquet Snappy' },
    { phase: 'Phase 4', title: 'PostgreSQL & PostGIS Database', status: 'Completed', detail: 'ST_DWithin, ST_Contains spatial queries, dynamic EAV measurements & climatology' },
    { phase: 'Phase 5', title: 'Semantic Retrieval Engine', status: 'Completed', detail: 'Multi-resolution chunking, Knowledge Graph layer, BM25 + FAISS hybrid search' },
    { phase: 'Phase 6', title: 'AI Intelligence & MCP Tools', status: 'Completed', detail: 'LiteLLM provider abstraction, MCP 10-tool server, reasoning & verification layer' },
    { phase: 'Phase 7', title: 'Multi-Agent & 3D Visualization', status: 'Completed', detail: 'Supervisor & 9 worker fleet, Plotly 3D visualizer, dashboard & report generator' },
  ];

  return (
    <section id="roadmap" className="py-24 bg-[#021322] relative overflow-hidden border-t border-[#5EE6FF]/10">
      <Container size="xl">
        <SectionTitle
          badgeText="Verified Systems Milestone"
          title="System Architecture Roadmap"
          subtitle="All 7 architectural phases fully engineered, verified, and pushed to production."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-[#06283D]/60 border border-[#5EE6FF]/20 hover:border-[#00B4FF] transition-all relative group shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[#5EE6FF] bg-[#031B2E] px-2.5 py-1 rounded-md border border-[#5EE6FF]/30">
                  {p.phase}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full border border-[#22C55E]/30">
                  <CheckCircle2 className="w-3 h-3" /> {p.status}
                </span>
              </div>

              <h4 className="text-base font-bold font-heading text-white group-hover:text-[#5EE6FF] transition-colors mb-2">
                {p.title}
              </h4>
              <p className="text-xs text-[#A8C7D8] font-light leading-relaxed">
                {p.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
