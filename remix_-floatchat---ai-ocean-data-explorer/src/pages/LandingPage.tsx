import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { TechCarouselSection } from '../components/sections/TechCarouselSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { PipelineSection } from '../components/sections/PipelineSection';
import { DemoPreviewSection } from '../components/sections/DemoPreviewSection';
import { VizShowcaseSection } from '../components/sections/VizShowcaseSection';
import { StatsSection } from '../components/sections/StatsSection';
import { ResearchImpactSection } from '../components/sections/ResearchImpactSection';
import { CtaSection } from '../components/sections/CtaSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <TechCarouselSection />
      <FeaturesSection />
      <PipelineSection />
      <DemoPreviewSection />
      <VizShowcaseSection />
      <StatsSection />
      <ResearchImpactSection />
      <CtaSection />
    </div>
  );
};
