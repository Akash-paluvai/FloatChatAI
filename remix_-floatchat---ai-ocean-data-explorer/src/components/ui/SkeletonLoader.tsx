import React from 'react';

export interface SkeletonLoaderProps {
  variant?: 'line' | 'card' | 'chart' | 'avatar';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'line',
  count = 1,
  className = '',
}) => {
  const items = Array.from({ length: count });

  const getVariantClasses = () => {
    switch (variant) {
      case 'avatar':
        return 'w-10 h-10 rounded-full';
      case 'card':
        return 'w-full h-48 rounded-2xl';
      case 'chart':
        return 'w-full h-64 rounded-2xl';
      case 'line':
      default:
        return 'w-full h-4 rounded-md';
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {items.map((_, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r from-[#06283D]/80 via-[#00B4FF]/10 to-[#06283D]/80 bg-[length:200%_100%] animate-[shimmer_2s_infinite] ${getVariantClasses()} ${className}`}
        />
      ))}
    </div>
  );
};
