import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { MessageSquare, Cpu, ShieldCheck, LineChart, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Ask Natural Language Prompt',
      desc: 'Type any ocean query like "Show thermocline depth in Bay of Bengal" or "Plot 3D hydrographic section".',
      icon: MessageSquare,
      color: 'from-[#00B4FF]/30 to-[#06283D]'
    },
    {
      num: '02',
      title: 'Multi-Agent & MCP Execution',
      desc: 'SupervisorAgent decomposes query. Worker agents execute PostGIS spatial queries, hybrid vector search, and climatology.',
      icon: Cpu,
      color: 'from-[#5EE6FF]/30 to-[#06283D]'
    },
    {
      num: '03',
      title: 'Scientific Evidence Verification',
      desc: 'ValidationAgent checks QC flags (1-4) and verifies evidence. Rejects ungrounded or hallucinated statements.',
      icon: ShieldCheck,
      color: 'from-[#38BDF8]/30 to-[#06283D]'
    },
    {
      num: '04',
      title: 'Interactive Visual Report',
      desc: 'Plotly 3D charts, depth curves, interactive maps, and exact ARGO GDAC citations are generated instantly.',
      icon: LineChart,
      color: 'from-[#00B4FF]/30 to-[#06283D]'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#031B2E] relative overflow-hidden">
      <Container size="xl">
        <SectionTitle
          badgeText="Simple 4-Step Process"
          title="How FloatChat Works"
          subtitle="From natural language prompt to publication-grade scientific reports in seconds."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative group"
              >
                <div className={`h-full p-6 rounded-3xl bg-gradient-to-br ${step.color} border border-[#5EE6FF]/20 backdrop-blur-xl group-hover:border-[#00B4FF] transition-all flex flex-col justify-between shadow-xl`}>
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono font-extrabold text-2xl text-[#5EE6FF] opacity-90">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-[#031B2E] border border-[#5EE6FF]/30 flex items-center justify-center text-[#5EE6FF] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-[#5EE6FF] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#A8C7D8] font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-1 text-[11px] font-mono text-[#5EE6FF]">
                    <span>Step {step.num} Automated</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
