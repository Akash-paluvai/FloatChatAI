import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Database, Radio } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { SearchBar } from '../ui/SearchBar';
import { HeroIllustration } from '../interactive/HeroIllustration';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
      {/* Ambient background glowing circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-radial-ocean pointer-events-none opacity-60 blur-3xl" />

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col gap-6 text-left"
          >
            <div className="flex items-center gap-3">
              <Badge variant="highlight" glowing icon={<Radio className="w-3.5 h-3.5" />}>
                ARGO Ocean Data Explorer
              </Badge>
              <Badge variant="phase2">Phase 1 Live</Badge>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight text-white leading-[1.1]">
              Talk to the <br />
              <span className="gradient-hero-heading">Ocean.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#A8C7D8] font-normal leading-relaxed max-w-2xl">
              Explore oceanographic data through natural language conversations powered by AI. Query temperature profiles, salinity anomalies, and 3,800+ ARGO floats effortlessly.
            </p>

            {/* Natural Language Quick Search Bar Trigger */}
            <div className="pt-2">
              <SearchBar placeholder="Ask FloatChat: 'Show temperature near Bay of Bengal'..." />
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to={ROUTES.DEMO}>
                <Button
                  variant="gradient"
                  size="lg"
                  leftIcon={<Sparkles className="w-5 h-5" />}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Explore Demo
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<Compass className="w-5 h-5" />}
                >
                  Learn More
                </Button>
              </a>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#5EE6FF]/15 max-w-xl">
              <div>
                <span className="text-2xl font-bold font-heading text-white">3,840+</span>
                <p className="text-xs text-[#A8C7D8]">ARGO Floats</p>
              </div>
              <div>
                <span className="text-2xl font-bold font-heading text-[#5EE6FF]">2.4M+</span>
                <p className="text-xs text-[#A8C7D8]">Parsed Profiles</p>
              </div>
              <div>
                <span className="text-2xl font-bold font-heading text-[#00B4FF]">Open</span>
                <p className="text-xs text-[#A8C7D8]">Research Standard</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
