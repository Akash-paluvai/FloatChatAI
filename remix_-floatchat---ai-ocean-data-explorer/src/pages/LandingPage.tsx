import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { HeroSection } from '../components/sections/HeroSection';
import { DemoPreviewSection } from '../components/sections/DemoPreviewSection';
import { VizShowcaseSection } from '../components/sections/VizShowcaseSection';
import { StatsSection } from '../components/sections/StatsSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { ArchitectureSection } from '../components/sections/ArchitectureSection';
import { TechStackSection } from '../components/sections/TechStackSection';
import { RoadmapSection } from '../components/sections/RoadmapSection';
import { CtaSection } from '../components/sections/CtaSection';

export const LandingPage: React.FC = () => {
  return (
    <MainLayout title="Talk to the Ocean with AI">
      {/* 1. Hero Showcase with interactive prompt trigger */}
      <HeroSection />

      {/* 2. Live Interactive AI Copilot & Map / SQL Preview */}
      <DemoPreviewSection />

      {/* 3. 3D & Profile Scientific Visualization Suite Showcase */}
      <VizShowcaseSection />

      {/* 4. Telemetry Metrics & Data Scale Banner */}
      <StatsSection />

      {/* 5. Enterprise Multi-Agent & Platform Capabilities */}
      <FeaturesSection />

      {/* 6. How FloatChat Multi-Agent RAG Pipeline Works */}
      <HowItWorksSection />

      {/* 7. Multi-Agent System & DAG Architecture */}
      <ArchitectureSection />

      {/* 8. Tech Stack */}
      <TechStackSection />

      {/* 9. Verified Roadmap & System Status */}
      <RoadmapSection />

      {/* 10. High Impact Call to Action */}
      <CtaSection />
    </MainLayout>
  );
};
