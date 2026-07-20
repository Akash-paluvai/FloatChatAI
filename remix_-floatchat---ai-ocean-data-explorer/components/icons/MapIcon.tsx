import React from 'react';

export const MapIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        strokeWidth="2"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0-6V4a1 1 0 011-1h4a1 1 0 011 1v3m-6 10l5.447 2.724A1 1 0 0016 20.382V9.618a1 1 0 00-1.447-.894L9 11m0 9v-6m0-6l6-3m-6 3l-6-3" 
        />
    </svg>
);
