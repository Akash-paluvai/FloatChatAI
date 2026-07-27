import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Database, Radio, Bot, LineChart, Layers, MapPin } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { SearchBar } from '../ui/SearchBar';
import { HeroIllustration } from '../interactive/HeroIllustration';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handlePromptClick = (promptText: string) => {
    navigate(`${ROUTES.DEMO}?query=${encodeURIComponent(promptText)}`);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-6 pb-20 overflow-hidden">
      {/* Ambient background glowing radial elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-radial-ocean pointer-events-none opacity-70 blur-3xl" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#00B4FF]/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Interactive Prompts & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col gap-6 text-left"
          >
            {/* Live Operational Status Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="highlight" glowing icon={<Radio className="w-3.5 h-3.5 animate-pulse text-[#5EE6FF]" />}>
                Multi-Agent AI Engine Active
              </Badge>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06283D]/90 border border-[#5EE6FF]/30 text-xs font-mono text-[#5EE6FF]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                3,840 ARGO Floats Live
              </span>
            </div>

            {/* High-Impact Gradient Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight text-white leading-[1.08]">
              Talk to the <br />
              <span className="gradient-hero-heading">Ocean with AI.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#A8C7D8] font-normal leading-relaxed max-w-2xl">
              Explore ARGO oceanographic data through natural language conversations. Query temperature depth profiles, thermocline boundaries, and salinity anomalies with 100% grounded citations.
            </p>

            {/* Interactive Natural Language Search Input */}
            <div className="pt-1">
              <SearchBar placeholder="Ask FloatChat: 'Show temperature profiles near Bay of Bengal'..." />
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#A8C7D8]/70 font-mono text-[11px]">Popular Queries:</span>
              {[
                "🌡️ Surface Temp in Bay of Bengal",
                "🌊 3D Hydrographic Section",
                "📊 Salinity Anomalies 2024",
                "📍 Track Float #2901234"
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt.replace(/^[^a-zA-Z0-9]+/, ''))}
                  className="px-3 py-1.5 rounded-xl bg-[#06283D]/80 border border-[#5EE6FF]/20 text-[#5EE6FF] hover:border-[#00B4FF] hover:bg-[#00B4FF]/10 transition-all font-mono text-[11px] flex items-center gap-1 shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link to={ROUTES.DEMO}>
                <Button
                  variant="gradient"
                  size="lg"
                  leftIcon={<Sparkles className="w-5 h-5" />}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Launch AI Copilot
                </Button>
              </Link>
              <Link to={ROUTES.DASHBOARD}>
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<LineChart className="w-5 h-5" />}
                >
                  3D Visualizer
                </Button>
              </Link>
            </div>

            {/* Micro Metrics Banner */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#5EE6FF]/15 max-w-xl">
              <div className="glass-panel p-3 rounded-2xl border border-white/10">
                <span className="text-2xl font-bold font-heading text-white">3,840+</span>
                <p className="text-xs text-[#A8C7D8] font-mono">ARGO Floats</p>
              </div>
              <div className="glass-panel p-3 rounded-2xl border border-white/10">
                <span className="text-2xl font-bold font-heading text-[#5EE6FF]">2.4M+</span>
                <p className="text-xs text-[#A8C7D8] font-mono">Parsed Profiles</p>
              </div>
              <div className="glass-panel p-3 rounded-2xl border border-white/10">
                <span className="text-2xl font-bold font-heading text-[#00B4FF]">95.7%</span>
                <p className="text-xs text-[#A8C7D8] font-mono">AI Groundedness</p>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Dynamic Interactive Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
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
