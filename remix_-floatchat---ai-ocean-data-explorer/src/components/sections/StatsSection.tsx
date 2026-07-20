import React from 'react';
import { motion } from 'framer-motion';
import { Database, Activity, Target, Zap, Waves } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      id: 'measurements',
      value: '10M+',
      label: 'Ocean Measurements',
      sublabel: 'High-precision temperature, salinity, & pressure points',
      icon: Database,
      glow: '#00B4FF'
    },
    {
      id: 'profiles',
      value: '100K+',
      label: 'ARGO Profiles',
      sublabel: 'Globally indexed float telemetry cycles',
      icon: Waves,
      glow: '#5EE6FF'
    },
    {
      id: 'accuracy',
      value: '95%',
      label: 'Query Accuracy',
      sublabel: 'Validated SQL translation via PostGIS & RAG',
      icon: Target,
      glow: '#38BDF8'
    },
    {
      id: 'response-time',
      value: '<3 sec',
      label: 'Response Time',
      sublabel: 'End-to-end vector search & rendering speed',
      icon: Zap,
      glow: '#22C55E'
    },
    {
      id: 'variables',
      value: '50+',
      label: 'Ocean Variables',
      sublabel: 'Including TEMP, PSAL, PRES, DOXY, CHLA, NITRATE',
      icon: Activity,
      glow: '#00B4FF'
    }
  ];

  return (
    <section className="py-20 bg-[#031B2E] border-y border-white/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-48 bg-[#00B4FF]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#5EE6FF]">
            Platform Metrics & Scalability
          </span>
          <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-2">
            Built for Massive Oceanographic Scale
          </h3>
        </div>

        {/* 5 Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#5EE6FF]/40 text-center flex flex-col items-center justify-between group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#06283D] border border-white/10 flex items-center justify-center mb-4 text-[#5EE6FF] group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight group-hover:text-[#5EE6FF] transition-colors">
                  {stat.value}
                </span>
                <h4 className="font-heading font-bold text-xs text-[#A8C7D8] uppercase tracking-wider">
                  {stat.label}
                </h4>
              </div>

              <p className="text-[11px] text-[#A8C7D8] font-light mt-3 leading-snug">
                {stat.sublabel}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
