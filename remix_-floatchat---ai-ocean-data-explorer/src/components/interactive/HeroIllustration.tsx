import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Globe, Database, Brain, ArrowRight, Zap, Radio } from 'lucide-react';

export const HeroIllustration: React.FC = () => {
  const nodes = [
    { id: 'ocean', title: 'Ocean Data', desc: 'ARGO Buoy Sensors', icon: Waves, color: '#00B4FF', x: '10%', y: '20%' },
    { id: 'earth', title: 'Earth Systems', desc: 'Global Telemetry', icon: Globe, color: '#5EE6FF', x: '80%', y: '15%' },
    { id: 'database', title: 'Parquet DB', desc: 'NetCDF / PostGIS', icon: Database, color: '#38BDF8', x: '15%', y: '75%' },
    { id: 'ai', title: 'AI Engine', desc: 'RAG & LangChain', icon: Brain, color: '#A855F7', x: '75%', y: '70%' },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center p-4">
      {/* Background radial glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00B4FF]/20 via-[#5EE6FF]/10 to-transparent blur-3xl animate-pulse-slow" />

      {/* SVG Connecting Pulse Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B4FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Diagonal and cross connections */}
        <motion.path
          d="M 120 100 L 380 320"
          stroke="url(#lineGrad1)"
          strokeWidth="2"
          strokeDasharray="6,6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M 380 90 L 140 330"
          stroke="url(#lineGrad1)"
          strokeWidth="2"
          strokeDasharray="6,6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Central FloatChat Core Node */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-32 h-32 rounded-3xl bg-gradient-to-br from-[#06283D] to-[#031B2E] border-2 border-[#00B4FF] flex flex-col items-center justify-center p-3 text-center shadow-[0_0_50px_rgba(0,180,255,0.4)]"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#00B4FF]/20 flex items-center justify-center mb-1 border border-[#00B4FF]/40">
          <Zap className="w-6 h-6 text-[#5EE6FF] animate-pulse" />
        </div>
        <span className="text-xs font-bold font-heading text-white">FloatChat Core</span>
        <span className="text-[9px] text-[#A8C7D8] font-mono">Phase 1 Hub</span>
      </motion.div>

      {/* Outer 4 Pillar Floating Cards */}
      {nodes.map((node, idx) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{
              duration: 4,
              delay: idx * 0.4,
              y: { duration: 3 + idx, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ left: node.x, top: node.y }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-[#06283D]/90 border border-[#5EE6FF]/30 backdrop-blur-xl shadow-xl flex items-center gap-3 w-44 hover:border-[#00B4FF] transition-all group"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md"
              style={{ backgroundColor: `${node.color}20`, border: `1px solid ${node.color}50` }}
            >
              <Icon className="w-5 h-5" style={{ color: node.color }} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white group-hover:text-[#5EE6FF] transition-colors">
                {node.title}
              </span>
              <span className="text-[10px] text-[#A8C7D8] font-mono">{node.desc}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
