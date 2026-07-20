import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Waves } from 'lucide-react';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#031B2E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Large Gradient Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-br from-[#06283D] via-[#031B2E] to-[#00B4FF]/20 border border-[#5EE6FF]/30 p-10 sm:p-16 text-center overflow-hidden shadow-[0_20px_70px_rgba(0,180,255,0.25)]"
        >
          {/* Ambient Background Water Effect */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#00B4FF]/20 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#5EE6FF]/20 blur-[140px] rounded-full pointer-events-none" />

          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#031B2E] border border-[#5EE6FF]/40 text-[#5EE6FF] mb-6 shadow-xl">
            <Waves className="w-8 h-8 animate-pulse" />
          </div>

          {/* Headline */}
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl xl:text-6xl text-white tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            Ready to Explore the Ocean with <span className="gradient-ocean-text">AI?</span>
          </h2>

          <p className="text-[#A8C7D8] text-base sm:text-lg max-w-2xl mx-auto font-light mb-10 leading-relaxed">
            Start querying 10M+ ARGO profile measurements instantly using natural language. Built for researchers, students, and ocean advocates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link
              to="/demo"
              className="group inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-gradient-to-r from-[#00B4FF] to-[#38BDF8] text-[#031B2E] font-heading font-bold text-sm shadow-[0_0_35px_rgba(0,180,255,0.6)] hover:shadow-[0_0_50px_rgba(94,230,255,0.9)] transition-all duration-300 hover:-translate-y-1"
            >
              <Sparkles className="w-4 h-4 text-[#031B2E]" />
              <span>Launch Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/docs"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#031B2E]/90 border border-white/15 text-white font-heading font-semibold text-sm hover:border-[#5EE6FF]/50 hover:bg-[#06283D] backdrop-blur-md transition-all duration-300"
            >
              <BookOpen className="w-4 h-4 text-[#5EE6FF]" />
              <span>View Documentation</span>
            </Link>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
