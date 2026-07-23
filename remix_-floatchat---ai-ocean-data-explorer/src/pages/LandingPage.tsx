import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { HeroSection } from '../components/sections/HeroSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { TechStackSection } from '../components/sections/TechStackSection';
import { ArchitectureSection } from '../components/sections/ArchitectureSection';
import { RoadmapSection } from '../components/sections/RoadmapSection';
import { CtaSection } from '../components/sections/CtaSection';

export const LandingPage: React.FC = () => {
  return (
    <MainLayout title="Talk to the Ocean with AI">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TechStackSection />
      <ArchitectureSection />
      <RoadmapSection />
      <CtaSection />
    </MainLayout>
  );
};
