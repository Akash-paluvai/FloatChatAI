import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../layout/GlassCard';
import { Anchor, CloudSun, LandPlot, GraduationCap, Fish, ShieldAlert, CheckCircle } from 'lucide-react';

export const ResearchImpactSection: React.FC = () => {
  const domains = [
    {
      id: 'marine-research',
      title: 'Marine Scientific Research',
      description: 'Accelerate oceanographic literature exploration and deep-ocean profile discovery without manual NetCDF scripting.',
      useCase: 'Deep-ocean thermocline & biogeochemical oxygen tracking',
      icon: Anchor,
      gradient: 'from-[#00B4FF]/20 to-[#06283D]'
    },
    {
      id: 'climate-monitoring',
      title: 'Climate Monitoring & El Niño',
      description: 'Analyze decadal sea-surface temperature anomalies, Indian Ocean Dipole (IOD) events, and heat content change.',
      useCase: 'Predicting extreme monsoon variations & thermal stress',
      icon: CloudSun,
      gradient: 'from-[#5EE6FF]/20 to-[#06283D]'
    },
    {
      id: 'policy-making',
      title: 'Maritime Policy Making',
      description: 'Provide climate ministers, coastal authorities, and environmental agencies with evidence-based ocean reports.',
      useCase: 'Coastal protection policies & carbon sink assessment',
      icon: LandPlot,
      gradient: 'from-[#38BDF8]/20 to-[#06283D]'
    },
    {
      id: 'education',
      title: 'University Education & STEM',
      description: 'Allow oceanography students to converse with live ocean data and learn physical dynamics interactively.',
      useCase: 'Interactive T-S diagram labs & data science courses',
      icon: GraduationCap,
      gradient: 'from-[#00B4FF]/20 to-[#06283D]'
    },
    {
      id: 'fisheries',
      title: 'Fisheries & Marine Life',
      description: 'Track sea surface salinity and chlorophyll boundaries for marine ecosystem preservation and sustainable fisheries.',
      useCase: 'Identifying Potential Fishing Zones (PFZ) & oxygen fronts',
      icon: Fish,
      gradient: 'from-[#5EE6FF]/20 to-[#06283D]'
    },
    {
      id: 'disaster-prep',
      title: 'Disaster & Cyclone Preparedness',
      description: 'Monitor upper-ocean heat content (UOHC) prior to cyclone formation in the Bay of Bengal & Arabian Sea.',
      useCase: 'Early cyclone intensification risk alerts',
      icon: ShieldAlert,
      gradient: 'from-[#38BDF8]/20 to-[#06283D]'
    }
  ];

  return (
    <section className="py-24 bg-[#021422] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06283D] border border-[#5EE6FF]/30 text-[#5EE6FF] text-xs font-mono">
            <Anchor className="w-3.5 h-3.5" />
            Global Societal Impact
          </div>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            Empowering <span className="gradient-ocean-text">Ocean Stakeholders</span>
          </h2>
          <p className="text-[#A8C7D8] text-base font-light">
            FloatChat transforms raw scientific telemetry into high-impact insights across key global domains.
          </p>
        </div>

        {/* 6 Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domains.map((d, idx) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <GlassCard className="h-full flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#06283D] border border-[#5EE6FF]/30 flex items-center justify-center text-[#5EE6FF] group-hover:scale-110 group-hover:border-[#5EE6FF] transition-all">
                    <d.icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-[#5EE6FF] transition-colors">
                    {d.title}
                  </h3>

                  <p className="text-xs text-[#A8C7D8] leading-relaxed font-light">
                    {d.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-[#5EE6FF]">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{d.useCase}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
