import React from 'react';
import { motion } from 'framer-motion';

export const TechCarouselSection: React.FC = () => {
  const techStack = [
    { name: 'Python', category: 'Backend & Data', color: '#3776AB' },
    { name: 'FastAPI', category: 'Async API Engine', color: '#009688' },
    { name: 'PostgreSQL', category: 'Relational DB', color: '#4169E1' },
    { name: 'PostGIS', category: 'Spatial Indexing', color: '#336791' },
    { name: 'LangChain', category: 'AI Orchestration', color: '#1C3C3C' },
    { name: 'OpenAI', category: 'LLM Reasoning', color: '#10A37F' },
    { name: 'FAISS', category: 'Vector Search', color: '#00B4FF' },
    { name: 'ChromaDB', category: 'Embeddings Store', color: '#FF4500' },
    { name: 'Plotly', category: 'Scientific Viz', color: '#3F4F75' },
    { name: 'Dask', category: 'Parallel Computing', color: '#FDA50F' },
    { name: 'Streamlit', category: 'Data Prototyping', color: '#FF4B4B' },
    { name: 'Docker', category: 'Containerization', color: '#2496ED' },
  ];

  return (
    <section className="py-12 bg-[#021422] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#A8C7D8]">
          Powered by Cutting-Edge Open-Source & AI Infrastructure
        </span>
      </div>

      {/* Infinite Horizontal Carousel */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Left/Right Fading Overlays */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#021422] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#021422] to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
          className="flex items-center gap-6 whitespace-nowrap"
        >
          {[...techStack, ...techStack].map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#06283D]/60 border border-white/10 hover:border-[#5EE6FF]/40 backdrop-blur-md transition-all duration-300"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}
              />
              <div className="flex flex-col text-left">
                <span className="font-heading font-semibold text-xs text-white">{item.name}</span>
                <span className="text-[9px] font-mono text-[#A8C7D8]">{item.category}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
