import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full border-[#00B4FF]/20 border-t-[#00B4FF] border-r-[#5EE6FF] animate-spin`}
        />
        <div className="absolute inset-0 rounded-full border border-[#00B4FF]/30 animate-ping opacity-25" />
      </div>
      {label && <span className="text-xs font-medium text-[#A8C7D8] animate-pulse">{label}</span>}
    </div>
  );
};
