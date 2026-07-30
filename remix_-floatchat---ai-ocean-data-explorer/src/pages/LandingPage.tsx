import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { HeroSection } from '../components/sections/HeroSection';
import { DemoPreviewSection } from '../components/sections/DemoPreviewSection';
import { VizShowcaseSection } from '../components/sections/VizShowcaseSection';
import { StatsSection } from '../components/sections/StatsSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { CtaSection } from '../components/sections/CtaSection';

export const LandingPage: React.FC = () => {
  return (
    <MainLayout title="Talk to the Ocean with AI">
      {/* 1. Hero Showcase with interactive prompt triggers & live stats */}
      <HeroSection />

      {/* 2. Real-Data Scale & Live Telemetry Metrics */}
      <StatsSection />

      {/* 3. Live Interactive AI Explorer & Map / SQL Preview */}
      <DemoPreviewSection />

      {/* 4. Scientific Visualization Suite Showcase */}
      <VizShowcaseSection />

      {/* 5. How FloatChat Parquet & Analytics Pipeline Works */}
      <HowItWorksSection />

      {/* 6. High-Impact Call to Action */}
      <CtaSection />
    </MainLayout>
  );
};
