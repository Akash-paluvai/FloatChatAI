import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-medium text-[#A8C7D8]">{label}</label>}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3 text-[#A8C7D8] pointer-events-none">{leftIcon}</div>}
          <input
            ref={ref}
            className={`w-full rounded-xl bg-[#031B2E]/70 border border-[#5EE6FF]/20 px-4 py-2.5 text-sm text-white placeholder-[#A8C7D8]/50 focus:outline-none focus:border-[#00B4FF] focus:ring-2 focus:ring-[#00B4FF]/30 transition-all ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${error ? 'border-red-500 focus:ring-red-500/30' : ''} ${className}`}
            {...props}
          />
          {rightIcon && <div className="absolute right-3 text-[#A8C7D8]">{rightIcon}</div>}
        </div>
        {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
