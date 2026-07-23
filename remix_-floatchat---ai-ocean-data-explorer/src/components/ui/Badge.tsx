import React from 'react';

export interface BadgeProps {
  variant?: 'accent' | 'highlight' | 'phase2' | 'success' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  glowing?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'accent',
  size = 'md',
  children,
  className = '',
  icon,
  glowing = false,
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide transition-all select-none';

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  const variantStyles = {
    accent: 'bg-[#00B4FF]/15 text-[#00B4FF] border border-[#00B4FF]/30',
    highlight: 'bg-[#5EE6FF]/15 text-[#5EE6FF] border border-[#5EE6FF]/40',
    phase2: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    outline: 'bg-transparent text-[#A8C7D8] border border-[#A8C7D8]/30',
  };

  const glowEffect = glowing ? 'shadow-[0_0_12px_rgba(0,180,255,0.4)] animate-pulse' : '';

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${glowEffect} ${className}`}>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
