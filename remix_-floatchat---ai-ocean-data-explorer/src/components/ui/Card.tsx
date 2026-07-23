import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'solid' | 'bordered';
  hoverEffect?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  hoverEffect = true,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300 relative overflow-hidden';

  const variantStyles = {
    glass: 'bg-[#06283D]/50 backdrop-blur-md border border-[#5EE6FF]/15 shadow-xl shadow-[#031B2E]/50',
    solid: 'bg-[#06283D] border border-[#5EE6FF]/10 text-white',
    bordered: 'bg-[#031B2E]/80 border border-[#00B4FF]/30 backdrop-blur-lg',
  };

  const hoverStyles = hoverEffect
    ? 'hover:border-[#00B4FF]/50 hover:shadow-2xl hover:shadow-[#00B4FF]/20 hover:-translate-y-1'
    : '';

  return (
    <motion.div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
