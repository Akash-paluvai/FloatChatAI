import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import { ROADMAP_PHASES } from '../../constants/roadmap';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const RoadmapSection: React.FC = () => {
  return (
    <section id="roadmap" className="py-20 relative">
      <Container size="lg">
        <SectionTitle
          badgeText="Project Trajectory"
          title="Project Roadmap"
          subtitle="Clear 6-phase engineering trajectory from frontend design system to global deployment."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {ROADMAP_PHASES.map((phaseItem, idx) => {
            const isCompleted = phaseItem.status === 'completed';
            return (
              <motion.div
                key={phaseItem.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card
                  variant="glass"
                  className={`h-full flex flex-col justify-between ${
                    isCompleted ? 'border-[#00B4FF]/60 bg-[#00B4FF]/5 shadow-xl shadow-[#00B4FF]/10' : ''
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#5EE6FF]">
                        PHASE 0{phaseItem.phase}
                      </span>
                      {isCompleted ? (
                        <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                          Completed ✓
                        </Badge>
                      ) : (
                        <Badge variant="outline" icon={<Clock className="w-3.5 h-3.5" />}>
                          Planned
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold font-heading text-white">{phaseItem.title}</h3>
                      <p className="text-xs text-[#5EE6FF] font-mono mt-0.5">{phaseItem.subtitle}</p>
                      <p className="text-xs text-[#A8C7D8] font-normal leading-relaxed mt-2">
                        {phaseItem.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#5EE6FF]/10 flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-[#A8C7D8] uppercase">Deliverables:</span>
                      <ul className="flex flex-col gap-1">
                        {phaseItem.deliverables.map((item, dIdx) => (
                          <li key={dIdx} className="text-xs text-white/80 flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-[#00B4FF]' : 'bg-[#A8C7D8]/40'}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
