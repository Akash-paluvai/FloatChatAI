import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'cyan' | 'sky';
  hoverLift?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  hoverLift = true,
}) => {
  const borderGlows = {
    blue: 'hover:border-[#00B4FF]/40 hover:shadow-[0_0_30px_rgba(0,180,255,0.25)]',
    cyan: 'hover:border-[#5EE6FF]/40 hover:shadow-[0_0_30px_rgba(94,230,255,0.25)]',
    sky: 'hover:border-[#38BDF8]/40 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)]',
  };

  return (
    <motion.div
      whileHover={hoverLift ? { y: -6 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`glass-card rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl border border-white/10 ${borderGlows[glowColor]} ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </motion.div>
  );
};
