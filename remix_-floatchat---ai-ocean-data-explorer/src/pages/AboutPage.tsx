import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/layout/GlassCard';
import { Waves, Target, Cpu, Users, Award, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const roadmapSteps = [
    { phase: 'Phase 1 (Current)', title: 'Natural Language PostGIS & RAG Engine', status: 'Completed', desc: 'Ingestion of Indian Ocean ARGO profiles, PostGIS spatial queries, and interactive Leaflet map overlays.' },
    { phase: 'Phase 2 (Q4 2026)', title: 'Biogeochemical Float Parameter Expansion', status: 'In Progress', desc: 'Integration of Chlorophyll-a, Nitrate, pH, and Transmissometer telemetry vectors.' },
    { phase: 'Phase 3 (Q2 2027)', title: 'Global Real-time Satellite Telemetry Stream', status: 'Upcoming', desc: 'Direct WebSocket pipeline from NOAA GDAC and INCOIS satellite relays for instant profile alerts.' },
    { phase: 'Phase 4 (Q4 2027)', title: 'Multi-Modal Oceanographic AI Copilot', status: 'Upcoming', desc: 'Voice input, automated PDF paper draft generation, and autonomous anomaly detection agents.' }
  ];

  const teamMembers = [
    { name: 'Dr. Vikramaditya Sharma', role: 'Chief Oceanographic Scientist', org: 'Former Senior Scientist, INCOIS' },
    { name: 'Aarav Patel', role: 'Lead AI & RAG Engineer', org: 'Specialist in Vector Search & LLM Reasoning' },
    { name: 'Ananya Rao', role: 'Senior Systems Architect', org: 'Expert in PostGIS & High-Throughput Parquet Pipelines' }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#031B2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06283D] border border-[#5EE6FF]/30 text-[#5EE6FF] text-xs font-mono">
            <Waves className="w-3.5 h-3.5" />
            Our Mission & Vision
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            Democratizing Global <span className="gradient-ocean-text">Ocean Intelligence</span>
          </h1>
          <p className="text-[#A8C7D8] text-base font-light leading-relaxed">
            FloatChat was created to eliminate technical barriers between complex oceanographic NetCDF datasets and the scientists, students, and policymakers working to protect our oceans.
          </p>
        </div>

        {/* Vision & Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard glowColor="blue">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#06283D] border border-[#5EE6FF]/30 flex items-center justify-center text-[#5EE6FF]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-white">The Vision</h3>
              <p className="text-sm text-[#A8C7D8] leading-relaxed font-light">
                To create a unified, conversational interface for the world's physical oceanography data—where asking a question about ocean warming or salinity is as intuitive as chatting with an AI assistant.
              </p>
            </div>
          </GlassCard>

          <GlassCard glowColor="cyan">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#06283D] border border-[#5EE6FF]/30 flex items-center justify-center text-[#5EE6FF]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-white">The Technology</h3>
              <p className="text-sm text-[#A8C7D8] leading-relaxed font-light">
                Combining Retrieval-Augmented Generation (RAG) over vector databases with Model Context Protocol (MCP) tool execution, ensuring every answer is mathematically validated against PostGIS spatial databases.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Core Team */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading font-extrabold text-3xl text-white">Built by Ocean & AI Experts</h2>
            <p className="text-xs text-[#A8C7D8] mt-2 font-mono">Bridging domain physical oceanography with modern AI SaaS engineering.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((m, idx) => (
              <GlassCard key={idx} className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00B4FF] to-[#06283D] border border-[#5EE6FF]/40 mx-auto flex items-center justify-center text-white font-heading font-bold text-xl shadow-lg">
                  {m.name.charAt(0)}
                </div>
                <h4 className="font-heading font-bold text-lg text-white">{m.name}</h4>
                <p className="text-xs text-[#5EE6FF] font-mono">{m.role}</p>
                <p className="text-xs text-[#A8C7D8] font-light">{m.org}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Strategic Roadmap */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06283D] border border-white/10 text-xs font-mono text-[#5EE6FF] mb-2">
              <Rocket className="w-3.5 h-3.5" /> Future Scope
            </div>
            <h2 className="font-heading font-extrabold text-3xl text-white">Product Development Roadmap</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapSteps.map((step, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 relative overflow-hidden">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#00B4FF]/10 text-[#5EE6FF] border border-[#5EE6FF]/30">
                  {step.phase}
                </span>
                <h4 className="font-heading font-bold text-base text-white pt-1">{step.title}</h4>
                <p className="text-xs text-[#A8C7D8] leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8">
          <Link
            to="/demo"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00B4FF] to-[#38BDF8] text-[#031B2E] font-heading font-bold text-sm shadow-[0_0_30px_rgba(0,180,255,0.5)] hover:shadow-[0_0_45px_rgba(94,230,255,0.8)] transition-all"
          >
            <span>Experience FloatChat Live</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
