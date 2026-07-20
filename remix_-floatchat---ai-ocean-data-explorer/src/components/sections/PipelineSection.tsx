import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode, Database, Server, Cpu, Search, Sparkles, Network, Bot, BarChart3, LayoutDashboard, ChevronRight } from 'lucide-react';

export const PipelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 'netcdf', name: 'NetCDF Raw', tech: 'ARGO Telemetry', icon: FileCode, desc: 'Ingestion of binary NetCDF profile files directly from global GDAC assembly centres.', input: '.nc files', output: 'Raw arrays' },
    { id: 'parquet', name: 'Parquet Store', tech: 'PyArrow / Dask', icon: Server, desc: 'Partitioned columnar storage format optimized for high-throughput spatial scans.', input: 'Raw arrays', output: 'Parquet blocks' },
    { id: 'postgis', name: 'PostgreSQL', tech: 'PostGIS Spatial', desc: 'Indexed relational spatial database tracking float metadata, lat/lon bounds, and profile dates.', input: 'Parquet blocks', output: 'Spatial tables' },
    { id: 'vector', name: 'Vector DB', tech: 'Chroma / FAISS', icon: Database, desc: 'Dense vector embeddings generated for float trajectory logs and regional scientific summaries.', input: 'Text summaries', output: 'Embeddings' },
    { id: 'retriever', name: 'Retriever', tech: 'Hybrid Search', icon: Search, desc: 'Combines dense semantic vector retrieval with PostGIS spatial bounding box filters.', input: 'Embeddings', output: 'Top-k profiles' },
    { id: 'rag', name: 'RAG Pipeline', tech: 'LangChain', icon: Sparkles, desc: 'Assembles retrieved float telemetry context and system prompts for LLM reasoning.', input: 'Top-k profiles', output: 'Grounded prompt' },
    { id: 'mcp', name: 'MCP Protocol', tech: 'Model Context', icon: Network, desc: 'Model Context Protocol executes sandboxed tool calls to fetch live oceanographic metrics.', input: 'Grounded prompt', output: 'Tool results' },
    { id: 'llm', name: 'LLM Reasoner', tech: 'OpenAI GPT-4o', icon: Bot, desc: 'Synthesizes natural language explanations alongside structured SQL and plot specs.', input: 'Tool results', output: 'SQL + Text' },
    { id: 'viz', name: 'Viz Engine', tech: 'Plotly / Canvas', icon: BarChart3, desc: 'Dynamically constructs T-S curves, temperature depth profiles, and heatmaps.', input: 'SQL + Text', output: 'JSON charts' },
    { id: 'ui', name: 'Dashboard', tech: 'React + Leaflet', icon: LayoutDashboard, desc: 'Interactive client dashboard rendering live maps, streaming chat, and export controls.', input: 'JSON charts', output: 'Interactive UI' },
  ];

  return (
    <section id="pipeline" className="py-24 bg-[#021322] border-y border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06283D] border border-[#5EE6FF]/30 text-[#5EE6FF] text-xs font-mono">
            <Network className="w-3.5 h-3.5" />
            End-to-End Data Pipeline
          </div>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            How <span className="gradient-ocean-text">FloatChat</span> Works
          </h2>
          <p className="text-[#A8C7D8] text-base font-light">
            From raw satellite-transmitted NetCDF files to natural language insights in less than 3 seconds.
          </p>
        </div>

        {/* 10 Step Interactive Pipeline Bar */}
        <div className="relative mb-12 overflow-x-auto pb-6">
          <div className="flex items-center gap-3 min-w-max px-2">
            {steps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setActiveStep(idx)}
                    className={`group relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#00B4FF]/20 border-[#5EE6FF] shadow-[0_0_25px_rgba(94,230,255,0.4)] scale-105'
                        : 'bg-[#06283D]/60 border-white/10 hover:border-white/25 hover:bg-[#06283D]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                      isSelected ? 'bg-[#5EE6FF] text-[#031B2E]' : 'bg-[#031B2E] text-[#5EE6FF]'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-semibold text-xs text-white whitespace-nowrap">{step.name}</span>
                    <span className="text-[9px] font-mono text-[#A8C7D8]">{step.tech}</span>
                  </button>

                  {idx < steps.length - 1 && (
                    <div className="flex items-center text-[#5EE6FF]/40">
                      <div className="w-4 h-0.5 bg-[#5EE6FF]/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#5EE6FF] animate-pulse" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#5EE6FF]" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-8 rounded-3xl border border-[#5EE6FF]/30 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
        >
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#5EE6FF] px-2.5 py-1 rounded bg-[#5EE6FF]/10 border border-[#5EE6FF]/20">
                Step {activeStep + 1} of {steps.length}
              </span>
              <h3 className="font-heading font-bold text-2xl text-white">
                {steps[activeStep].name} — {steps[activeStep].tech}
              </h3>
            </div>
            <p className="text-sm text-[#A8C7D8] leading-relaxed font-light">
              {steps[activeStep].desc}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#A8C7D8]">Input Format:</span>
                <span className="text-white bg-[#031B2E] px-2 py-0.5 rounded border border-white/10">{steps[activeStep].input}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#A8C7D8]">Output Artifact:</span>
                <span className="text-[#5EE6FF] bg-[#031B2E] px-2 py-0.5 rounded border border-[#5EE6FF]/30">{steps[activeStep].output}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#00B4FF]/20 to-[#06283D] border border-[#5EE6FF]/40 flex items-center justify-center shadow-[0_0_40px_rgba(0,180,255,0.3)]">
              {React.createElement(steps[activeStep].icon, { className: "w-14 h-14 text-[#5EE6FF]" })}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
