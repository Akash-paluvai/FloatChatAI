import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Cpu, Database, Brain, LineChart, Lightbulb, ArrowRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    { step: '01', label: 'Ocean Data', sub: 'ARGO Telemetry & netCDF', icon: Waves, color: '#00B4FF' },
    { step: '02', label: 'Processing', sub: 'FastAPI Ingestion Pipeline', icon: Cpu, color: '#5EE6FF' },
    { step: '03', label: 'Database', sub: 'PostgreSQL + PostGIS', icon: Database, color: '#38BDF8' },
    { step: '04', label: 'AI Layer', sub: 'LangChain & RAG Agent', icon: Brain, color: '#A855F7' },
    { step: '05', label: 'Visualization', sub: 'Plotly & Map overlays', icon: LineChart, color: '#EC4899' },
    { step: '06', label: 'Insights', sub: 'Scientific Synthesis', icon: Lightbulb, color: '#10B981' },
  ];

  return (
    <section id="how-it-works" className="py-20 relative bg-[#031B2E]/60 border-y border-[#5EE6FF]/10">
      <Container size="xl">
        <SectionTitle
          badgeText="Conceptual Workflow"
          title="How FloatChat Works"
          subtitle="From autonomous deep sea sensors to AI-synthesized research insights."
        />

        {/* Horizontal Timeline Bar */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative flex flex-col items-center text-center p-5 rounded-2xl bg-[#06283D]/60 border border-[#5EE6FF]/15 backdrop-blur-md hover:border-[#00B4FF] transition-all group"
              >
                {/* Step pill */}
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#031B2E] text-[#5EE6FF] border border-[#5EE6FF]/30 mb-3">
                  STEP {item.step}
                </span>

                {/* Icon box */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}50` }}
                >
                  <Icon className="w-6 h-6" style={{ color: item.color }} />
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-[#5EE6FF] transition-colors">
                  {item.label}
                </h4>
                <p className="text-[11px] text-[#A8C7D8] mt-1 font-mono">{item.sub}</p>

                {/* Connecting arrow indicator on larger screens */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#00B4FF]/40">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
