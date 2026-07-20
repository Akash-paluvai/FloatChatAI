import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../layout/GlassCard';
import { Layers, Navigation, LineChart, Activity, Waves, Gauge, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VizShowcaseSection: React.FC = () => {
  const cards = [
    {
      id: 'heatmap',
      title: 'Ocean Surface Thermal Heatmap',
      subtitle: 'Spatial interpolation of surface sea temperatures (°C)',
      icon: Layers,
      metrics: [{ label: 'Coverage', value: 'Indian Ocean' }, { label: 'Grid Res', value: '0.25° Spatial' }],
      tag: 'Spatial Grid',
      previewGradient: 'from-[#00B4FF]/30 to-[#5EE6FF]/10'
    },
    {
      id: 'trajectory',
      title: 'ARGO Float Trajectory Paths',
      subtitle: 'Multi-year Lagrangian float drift & bathymetry tracking',
      icon: Navigation,
      metrics: [{ label: 'Active Floats', value: '3,800+ Worldwide' }, { label: 'Lifespan', value: '4-5 Years' }],
      tag: 'Geospatial Vector',
      previewGradient: 'from-[#5EE6FF]/30 to-[#38BDF8]/10'
    },
    {
      id: 'depth-profile',
      title: 'Vertical Depth Profile (0–2000m)',
      subtitle: 'Thermocline, pycnocline, and oxycline gradient curves',
      icon: LineChart,
      metrics: [{ label: 'Max Depth', value: '2,000 dbar' }, { label: 'Sample Pts', value: '1,000 / profile' }],
      tag: 'Depth Gradient',
      previewGradient: 'from-[#38BDF8]/30 to-[#00B4FF]/10'
    },
    {
      id: 'time-series',
      title: 'Temperature Time-Series Anomaly',
      subtitle: 'Decadal sea surface warming & seasonal oscillation analysis',
      icon: Activity,
      metrics: [{ label: 'Time Horizon', value: '2022 – 2026' }, { label: 'Resolution', value: '10-Day Cycle' }],
      tag: 'Temporal Trends',
      previewGradient: 'from-[#00B4FF]/30 to-[#06283D]'
    },
    {
      id: 'salinity-dist',
      title: 'Salinity Distribution Profile',
      subtitle: 'Freshwater river runoff vs evaporation salinity fronts',
      icon: Waves,
      metrics: [{ label: 'Range', value: '32.0 – 37.0 PSU' }, { label: 'Accuracy', value: '±0.005 PSU' }],
      tag: 'Halocline Viz',
      previewGradient: 'from-[#5EE6FF]/20 to-[#00B4FF]/10'
    },
    {
      id: 'ts-diagram',
      title: 'T-S (Temperature vs Salinity) Diagram',
      subtitle: 'Water mass identification (ASHSW, BOBW, IOIW)',
      icon: Gauge,
      metrics: [{ label: 'Sigma-t', value: 'Isopycnal Overlays' }, { label: 'Grounded RAG', value: 'Validated' }],
      tag: 'Physical Oceanography',
      previewGradient: 'from-[#38BDF8]/30 to-[#5EE6FF]/10'
    }
  ];

  return (
    <section className="py-24 bg-[#021322] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06283D] border border-[#5EE6FF]/30 text-[#5EE6FF] text-xs font-mono">
            <LineChart className="w-3.5 h-3.5" />
            Publication-Grade Graphics
          </div>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            Scientific <span className="gradient-ocean-text">Visualization Suite</span>
          </h2>
          <p className="text-[#A8C7D8] text-base font-light">
            Interactive, lightweight, vector-rendered charts engineered specifically for physical oceanographers and climate scientists.
          </p>
        </div>

        {/* 6 Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <GlassCard className="h-full flex flex-col justify-between group cursor-pointer">
                <div>
                  {/* Decorative Preview Banner */}
                  <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${card.previewGradient} border border-white/10 p-4 mb-5 flex items-center justify-between relative overflow-hidden group-hover:border-[#5EE6FF]/40 transition-colors`}>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#5EE6FF] px-2 py-0.5 rounded bg-[#031B2E]/80 border border-[#5EE6FF]/30">
                        {card.tag}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-white pt-1">{card.title}</h4>
                    </div>
                    <card.icon className="w-8 h-8 text-[#5EE6FF] opacity-80 group-hover:scale-110 transition-transform" />
                  </div>

                  <p className="text-xs text-[#A8C7D8] leading-relaxed font-light mb-6">
                    {card.subtitle}
                  </p>
                </div>

                {/* Metrics Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  {card.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="flex flex-col">
                      <span className="text-[10px] font-mono text-[#A8C7D8]">{m.label}</span>
                      <span className="font-heading font-semibold text-white text-xs">{m.value}</span>
                    </div>
                  ))}
                  <Link to="/dashboard" className="p-2 rounded-lg bg-[#06283D] border border-white/10 text-[#5EE6FF] group-hover:border-[#5EE6FF] transition-all">
                    <ArrowUpRight className="w-4 h-4" />
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
