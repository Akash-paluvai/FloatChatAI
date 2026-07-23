import React from 'react';
import { CheckCircle2, Clock, Server, Activity, ShieldCheck, Zap } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ROADMAP_PHASES } from '../constants/roadmap';
import { APP_CONFIG } from '../config/app';

export const StatusPage: React.FC = () => {
  return (
    <MainLayout title="System Status & Roadmap Matrix">
      <div className="py-12 relative">
        <Container size="lg" className="flex flex-col gap-12">
          {/* Header Status Banner */}
          <div className="p-8 rounded-3xl bg-[#06283D]/80 border border-[#00B4FF]/40 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-white">FloatChat System Status</h1>
                <p className="text-xs text-[#A8C7D8] font-mono mt-0.5">
                  Phase 1 Frontend System Operational • All UI Components & Layouts Ready
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="success" size="md" glowing icon={<Activity className="w-4 h-4" />}>
                Phase 1 Frontend Complete ✓
              </Badge>
            </div>
          </div>

          {/* Detailed Phase Readiness Table */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-[#00B4FF]" /> Engineering Phase Readiness Matrix
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {ROADMAP_PHASES.map((ph) => {
                const isComplete = ph.status === 'completed';
                return (
                  <Card
                    key={ph.phase}
                    variant="solid"
                    hoverEffect={false}
                    className={`p-6 bg-[#06283D]/60 border-[#5EE6FF]/15 ${
                      isComplete ? 'border-emerald-500/40 bg-emerald-500/5' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                            isComplete
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-[#031B2E] text-[#A8C7D8] border border-[#5EE6FF]/20'
                          }`}
                        >
                          P0{ph.phase}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-base font-bold font-heading text-white">{ph.title}</h4>
                            {isComplete ? (
                              <Badge variant="success" size="sm">✓ Complete</Badge>
                            ) : (
                              <Badge variant="outline" size="sm">Phase 2+ Scheduled</Badge>
                            )}
                          </div>
                          <p className="text-xs text-[#A8C7D8] font-mono mt-0.5">{ph.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {ph.deliverables.slice(0, 2).map((d, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-1 rounded bg-[#031B2E] text-[#5EE6FF] border border-[#5EE6FF]/20">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};
