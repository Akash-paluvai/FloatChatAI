import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { OceanWaveCanvas } from '../interactive/OceanWaveCanvas';
import { InteractiveNeuralDiagram } from '../interactive/InteractiveNeuralDiagram';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { Sparkles, ArrowRight, ShieldCheck, Database, Compass, Terminal } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const parallax = useMouseParallax(12);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden bg-radial-ocean">
      {/* Ocean Canvas Layer */}
      <OceanWaveCanvas />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#06283D]/80 border border-[#5EE6FF]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,180,255,0.2)]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5EE6FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00B4FF]"></span>
              </span>
              <span className="text-xs font-mono text-[#5EE6FF] tracking-wide">
                Next-Gen ARGO Ocean Intelligence System
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-5xl sm:text-6xl xl:text-7xl tracking-tight text-white leading-[1.08]">
              Talk to the <br />
              <span className="gradient-ocean-text">Ocean.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#A8C7D8] leading-relaxed max-w-2xl font-sans font-light">
              AI-powered conversational discovery and visualization of global ARGO oceanographic data using <span className="text-white font-medium">Retrieval-Augmented Generation (RAG)</span>, <span className="text-[#5EE6FF] font-mono">Model Context Protocol (MCP)</span>, and PostGIS spatial queries.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/demo"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00B4FF] to-[#38BDF8] text-[#031B2E] font-heading font-bold text-sm shadow-[0_0_30px_rgba(0,180,255,0.5)] hover:shadow-[0_0_45px_rgba(94,230,255,0.8)] transition-all duration-300 hover:-translate-y-1"
              >
                <Sparkles className="w-4 h-4 text-[#031B2E]" />
                <span>Try Live Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/docs"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-[#06283D]/60 border border-white/10 text-white font-heading font-semibold text-sm hover:border-[#5EE6FF]/40 hover:bg-[#06283D] backdrop-blur-md transition-all duration-300"
              >
                <Terminal className="w-4 h-4 text-[#5EE6FF]" />
                <span>Explore Architecture</span>
              </Link>
            </div>

            {/* Trust Metrics Pill */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#A8C7D8]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                <span>Safe PostGIS SQL Translation</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00B4FF]" />
                <span>10M+ ARGO Profiling Data Points</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Neural & Ocean Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <InteractiveNeuralDiagram />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
