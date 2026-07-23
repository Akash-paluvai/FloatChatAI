import React from 'react';
import { Badge } from './Badge';

export interface SectionTitleProps {
  badgeText?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  badgeText,
  title,
  subtitle,
  centered = true,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-3 ${centered ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      {badgeText && <Badge variant="accent" glowing>{badgeText}</Badge>}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight gradient-ocean-text">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base sm:text-lg text-[#A8C7D8] font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
