import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative flex flex-col gap-1 w-full" ref={ref}>
      {label && <span className="text-xs text-[#A8C7D8] font-medium">{label}</span>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/20 text-sm text-white hover:border-[#00B4FF]/50 transition-all"
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 text-[#A8C7D8] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl bg-[#06283D] border border-[#5EE6FF]/30 p-1.5 shadow-2xl backdrop-blur-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                opt.value === value
                  ? 'bg-[#00B4FF]/20 text-[#5EE6FF]'
                  : 'text-white/80 hover:bg-[#5EE6FF]/10 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
