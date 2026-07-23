import React from 'react';
import { motion } from 'framer-motion';
import { TECH_STACK } from '../../constants/techStack';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const TechStackSection: React.FC = () => {
  return (
    <section id="tech-stack" className="py-20 relative">
      <Container size="lg">
        <SectionTitle
          badgeText="Technology Stack"
          title="Powered by Modern Web & AI Architecture"
          subtitle="Built on cutting-edge open science frameworks, scalable databases, and LLM orchestration."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-12">
          {TECH_STACK.map((tech, idx) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card
                variant="glass"
                className="p-4 flex flex-col items-center justify-between text-center h-full hover:border-[#00B4FF] transition-all group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#00B4FF]/10 border border-[#00B4FF]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-base font-bold font-mono text-[#5EE6FF]">
                      {tech.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-[#5EE6FF] transition-colors">
                    {tech.name}
                  </span>
                  <span className="text-[9px] text-[#A8C7D8] uppercase tracking-wider font-mono">{tech.category}</span>
                </div>

                <div className="mt-3">
                  {tech.isPhase2Plus ? (
                    <Badge variant="phase2" size="sm">Phase 2+</Badge>
                  ) : (
                    <Badge variant="success" size="sm">Phase 1 Active</Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
