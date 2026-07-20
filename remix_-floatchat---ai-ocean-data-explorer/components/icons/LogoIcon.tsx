
import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M2 12h3l3-9 3 18 3-9h3" />
        <path d="M17 12h3l2-4" />
        <path d="M5 12h-3l-2 4" />
    </svg>
);
   