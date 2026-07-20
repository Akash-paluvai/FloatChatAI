import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../layout/GlassCard';
import { MessageSquareText, Cpu, MapPin, Navigation, LineChart, FileDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 'nl-search',
      title: 'Natural Language Ocean Search',
      description: 'Ask complex oceanographic questions in plain English. FloatChat converts your intent into validated PostGIS SQL and pandas queries automatically.',
      icon: MessageSquareText,
      tag: 'LLM Query Engine',
      color: 'blue' as const,
      queryExample: '"Show surface temperature trends near Bay of Bengal in 2024"'
    },
    {
      id: 'rag-retrieval',
      title: 'RAG-Powered Scientific Retrieval',
      description: 'Retrieval-Augmented Generation indexes oceanographic metadata, temperature depth matrices, and NetCDF research papers for grounded responses.',
      icon: Cpu,
      tag: 'ChromaDB + FAISS',
      color: 'cyan' as const,
      queryExample: 'Semantic similarity search across 100K+ profiles'
    },
    {
      id: 'interactive-maps',
      title: 'Interactive Ocean Maps',
      description: 'Explore live ARGO float locations, surface thermal gradients, salinity distribution, and spatial bounding boxes on interactive dark maps.',
      icon: MapPin,
      tag: 'PostGIS Geospatial',
      color: 'sky' as const,
      queryExample: 'Realtime CartoDB Dark Vector Layer Overlay'
    },
    {
      id: 'float-tracking',
      title: 'ARGO Float Trajectory Tracking',
      description: 'Track individual float drift paths across years, monitoring drift velocities, bathymetric depths, and active profiling status.',
      icon: Navigation,
      tag: 'INCOIS / GDAC Data',
      color: 'blue' as const,
      queryExample: 'Platform #2902745 • 142 profiles recorded'
    },
    {
      id: 'scientific-viz',
      title: 'Scientific Visualization Engine',
      description: 'Instant dynamic generation of T-S (Temperature vs Salinity) diagrams, depth profiles (0-2000m), time-series heatmaps, and anomalies.',
      icon: LineChart,
      tag: 'Plotly Scientific',
      color: 'cyan' as const,
      queryExample: 'Depth vs Temp • Thermocline & Oxycline Rendering'
    },
    {
      id: 'export-reports',
      title: 'Scientific Export & PDF Reports',
      description: 'Export clean NetCDF, GeoJSON, CSV, or publication-ready PDF research summaries with citation references for policymakers and papers.',
      icon: FileDown,
      tag: 'GeoJSON / NetCDF',
      color: 'sky' as const,
      queryExample: 'One-click publication export with confidence metrics'
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#031B2E] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#00B4FF]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5EE6FF]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06283D] border border-[#5EE6FF]/30 text-[#5EE6FF] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#5EE6FF] animate-pulse" />
            Core Platform Capabilities
          </div>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            Engineered for <span className="gradient-ocean-text">Scientific Rigor</span> & Speed
          </h2>
          <p className="text-[#A8C7D8] text-base font-light">
            Designed to bridge raw ocean telemetry with conversational AI, making oceanographic data instant, visual, and actionable.
          </p>
        </div>

        {/* 6 Glass Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <GlassCard glowColor={feat.color} className="h-full flex flex-col justify-between group">
                <div className="space-y-4">
                  {/* Top Row: Icon + Tag */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06283D] to-[#031B2E] border border-[#5EE6FF]/30 flex items-center justify-center text-[#5EE6FF] shadow-lg group-hover:scale-110 group-hover:border-[#5EE6FF] transition-all duration-300">
                      <feat.icon className="w-6 h-6 text-[#5EE6FF]" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#00B4FF]/10 text-[#5EE6FF] border border-[#5EE6FF]/20">
                      {feat.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-[#5EE6FF] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#A8C7D8] leading-relaxed font-light">
                    {feat.description}
                  </p>
                </div>

                {/* Example Snippet / Action Footnote */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#5EE6FF]">
                  <span className="truncate pr-2">{feat.queryExample}</span>
                  <Link to="/demo" className="text-white hover:text-[#5EE6FF] flex items-center gap-0.5 shrink-0">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
