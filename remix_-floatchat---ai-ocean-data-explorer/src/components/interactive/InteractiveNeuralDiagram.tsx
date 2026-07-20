import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Waves, Navigation, Cpu, Database, MessageSquareCode, Sparkles } from 'lucide-react';

export const InteractiveNeuralDiagram: React.FC = () => {
  const nodes = [
    { id: 'earth', label: 'Global Ocean', icon: Globe, color: '#00B4FF', x: 80, y: 70 },
    { id: 'floats', label: 'ARGO Floats', icon: Navigation, color: '#5EE6FF', x: 280, y: 60 },
    { id: 'ocean', label: 'NetCDF Telemetry', icon: Waves, color: '#38BDF8', x: 180, y: 190 },
    { id: 'db', label: 'PostGIS / Vector DB', icon: Database, color: '#00B4FF', x: 80, y: 310 },
    { id: 'neural', label: 'RAG + MCP AI', icon: Cpu, color: '#5EE6FF', x: 280, y: 310 },
    { id: 'chat', label: 'FloatChat UI', icon: MessageSquareCode, color: '#38BDF8', x: 180, y: 410 },
  ];

  const connections = [
    { from: 'earth', to: 'ocean' },
    { from: 'floats', to: 'ocean' },
    { from: 'ocean', to: 'db' },
    { from: 'ocean', to: 'neural' },
    { from: 'db', to: 'neural' },
    { from: 'neural', to: 'chat' },
  ];

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center p-4">
      {/* Background Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00B4FF]/20 via-[#5EE6FF]/10 to-transparent blur-3xl" />

      {/* Glass Panel Wrapper */}
      <div className="relative w-full h-full bg-[#06283D]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden flex items-center justify-center">
        
        {/* SVG Animated Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 480">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00B4FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#5EE6FF" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from)!;
            const toNode = nodes.find(n => n.id === conn.to)!;
            return (
              <g key={idx}>
                {/* Static Glowing Base Path */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="url(#lineGrad)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                {/* Animated Pulsing Data Packet */}
                <circle r="4" fill="#5EE6FF" filter="url(#glow)">
                  <animateMotion
                    path={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
                    dur={`${2 + idx * 0.5}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        <div className="relative w-full h-full">
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.15, y: -4 }}
              style={{ left: `${node.x - 40}px`, top: `${node.y - 40}px` }}
              className="absolute group cursor-pointer"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#031B2E]/90 border border-[#5EE6FF]/30 p-2.5 flex flex-col items-center justify-center text-center shadow-[0_0_20px_rgba(0,180,255,0.25)] group-hover:border-[#5EE6FF] group-hover:shadow-[0_0_30px_rgba(94,230,255,0.6)] transition-all duration-300">
                <node.icon className="w-6 h-6 mb-1 text-[#5EE6FF] group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-heading font-semibold text-white leading-tight">
                  {node.label}
                </span>
              </div>

              {/* Pulsing Outer Ring */}
              <div className="absolute -inset-1.5 rounded-2xl border border-[#5EE6FF]/20 animate-pulse pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Floating AI Badge Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#031B2E]/90 border border-[#5EE6FF]/40 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#5EE6FF] animate-spin" />
          <span className="text-[10px] font-mono text-white tracking-wide">RAG + MCP Realtime Pipeline</span>
        </div>

      </div>
    </div>
  );
};
