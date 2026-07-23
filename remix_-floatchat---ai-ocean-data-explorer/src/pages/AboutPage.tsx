import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Target, Compass, Cpu, Globe, Shield, Sparkles } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { Container } from '../components/ui/Container';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { APP_CONFIG } from '../config/app';

export const AboutPage: React.FC = () => {
  return (
    <MainLayout title="About Mission & Vision">
      <div className="py-12 relative">
        <Container size="lg" className="flex flex-col gap-16">
          {/* Header Hero */}
          <div className="text-center flex flex-col items-center gap-4">
            <Badge variant="accent" glowing icon={<Sparkles className="w-3.5 h-3.5" />}>
              Open Ocean Science
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold font-heading text-white tracking-tight">
              Democratizing <span className="gradient-ocean-text">Ocean Data</span> for Everyone
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-[#A8C7D8]">
              FloatChat bridges the gap between raw netCDF ARGO profiler telemetry and natural language AI discovery.
            </p>
          </div>

          {/* Mission & Vision Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="glass" className="p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00B4FF]/15 border border-[#00B4FF]/30 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#00B4FF]" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-white">Our Mission</h3>
              <p className="text-sm text-[#A8C7D8] leading-relaxed">
                To transform millions of complex oceanographic profiles into instant, plain-English answers. Researchers, marine biologists, and climate scientists can query thermocline depths, salinity anomalies, and climate trends without writing custom data ingestion pipelines.
              </p>
            </Card>

            <Card variant="glass" className="p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5EE6FF]/15 border border-[#5EE6FF]/30 flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#5EE6FF]" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-white">Our Vision</h3>
              <p className="text-sm text-[#A8C7D8] leading-relaxed">
                A world where Earth system observations are transparent, conversational, and universally accessible. By combining spatial databases (PostGIS) with LLM retrieval-augmented generation (RAG), FloatChat sets a new benchmark for open scientific data access.
              </p>
            </Card>
          </div>

          {/* Technology & Future Scope */}
          <div className="p-8 rounded-3xl bg-[#06283D]/60 border border-[#5EE6FF]/20 backdrop-blur-xl flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00B4FF]/20 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#5EE6FF]" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-white">Technology & Future Scope</h3>
                <span className="text-xs font-mono text-[#A8C7D8]">Phase 1 Foundation → Phase 6 Global Infrastructure</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#5EE6FF]/15 pt-6 text-xs text-[#A8C7D8]">
              <div>
                <h4 className="font-bold text-white mb-1">Open Data Standards</h4>
                <p>Built directly around global ARGO float datasets provided under open international research licenses.</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Decoupled Architecture</h4>
                <p>Phase 1 establishes a modular React 19 UI layer ready to connect to FastAPI microservices seamlessly.</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">AI Safety & Integrity</h4>
                <p>Strict self-correcting Text-to-SQL validators ensure query outputs accurately reflect physical ocean parameters.</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};
