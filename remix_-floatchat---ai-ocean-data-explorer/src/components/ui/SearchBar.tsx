import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Command } from 'lucide-react';
import { Dialog } from './Dialog';

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Ask FloatChat about ARGO ocean data...',
  onSearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const quickPrompts = [
    'Show temperature near Bay of Bengal',
    'Find salinity anomalies in Arabian Sea',
    'List active ARGO floats in Indian Ocean',
    'Compare 2022 vs 2024 surface ocean heat',
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (text: string) => {
    setQuery(text);
    if (onSearch) onSearch(text);
    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center justify-between w-full max-w-xl px-4 py-3 rounded-2xl bg-[#06283D]/60 border border-[#5EE6FF]/20 hover:border-[#00B4FF]/60 backdrop-blur-md cursor-pointer transition-all shadow-lg hover:shadow-[#00B4FF]/20"
      >
        <div className="flex items-center gap-3 text-[#A8C7D8]">
          <Search className="w-5 h-5 text-[#00B4FF] group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
            {placeholder}
          </span>
        </div>
        <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md bg-[#031B2E] border border-[#5EE6FF]/20 text-[#A8C7D8]">
          <Command className="w-3 h-3" /> K
        </kbd>
      </div>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Natural Language Search" maxWidth="lg">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-[#00B4FF]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type an ocean query or pick a prompt below..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#031B2E] border border-[#00B4FF]/40 text-white placeholder-[#A8C7D8]/50 focus:outline-none focus:ring-2 focus:ring-[#00B4FF]/40"
            />
          </div>

          <div>
            <span className="text-xs font-semibold text-[#A8C7D8] uppercase tracking-wider">Suggested Queries</span>
            <div className="flex flex-col gap-2 mt-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(prompt)}
                  className="flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl bg-[#031B2E]/60 hover:bg-[#00B4FF]/15 border border-transparent hover:border-[#00B4FF]/30 text-xs font-medium text-white transition-all group"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#5EE6FF]" />
                    {prompt}
                  </span>
                  <span className="text-[10px] text-[#A8C7D8] group-hover:text-[#00B4FF]">Run Demo →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
