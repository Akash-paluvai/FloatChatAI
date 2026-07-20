import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, Sparkles, Database, FileText, Cpu, Mail, Globe, Code2, Share2, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#021322] border-t border-[#5EE6FF]/15 text-[#A8C7D8] pt-16 pb-12 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#00B4FF]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00B4FF] to-[#06283D] p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(0,180,255,0.4)]">
                <div className="w-full h-full bg-[#031B2E] rounded-[10px] flex items-center justify-center">
                  <Waves className="w-5 h-5 text-[#5EE6FF]" />
                </div>
              </div>
              <span className="font-heading font-bold text-2xl text-white tracking-tight">FloatChat</span>
            </Link>

            <p className="text-xs leading-relaxed max-w-sm text-[#A8C7D8]">
              Conversational AI intelligence engine for global ARGO oceanographic data. Accelerated by RAG, Model Context Protocol (MCP), and PostGIS spatial indexing.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#06283D] border border-white/10 flex items-center justify-center text-[#A8C7D8] hover:text-[#5EE6FF] hover:border-[#5EE6FF]/40 transition-all duration-300"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#06283D] border border-white/10 flex items-center justify-center text-[#A8C7D8] hover:text-[#5EE6FF] hover:border-[#5EE6FF]/40 transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#06283D] border border-white/10 flex items-center justify-center text-[#A8C7D8] hover:text-[#5EE6FF] hover:border-[#5EE6FF]/40 transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-xs uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-[#5EE6FF] transition-colors">Home Landing</Link></li>
              <li><Link to="/demo" className="hover:text-[#5EE6FF] transition-colors flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-[#5EE6FF]" /> AI Chat Copilot</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#5EE6FF] transition-colors">Ocean Dashboard</Link></li>
              <li><Link to="/docs" className="hover:text-[#5EE6FF] transition-colors">Architecture & Docs</Link></li>
              <li><Link to="/about" className="hover:text-[#5EE6FF] transition-colors">About FloatChat</Link></li>
            </ul>
          </div>

          {/* Technical Docs */}
          <div>
            <h4 className="font-heading font-semibold text-white text-xs uppercase tracking-wider mb-4">Data & AI</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#pipeline" className="hover:text-[#5EE6FF] transition-colors flex items-center gap-1"><Cpu className="w-3 h-3 text-[#00B4FF]" /> MCP Protocol</a></li>
              <li><a href="#pipeline" className="hover:text-[#5EE6FF] transition-colors flex items-center gap-1"><Database className="w-3 h-3 text-[#00B4FF]" /> ARGO NetCDF DB</a></li>
              <li><a href="#pipeline" className="hover:text-[#5EE6FF] transition-colors flex items-center gap-1"><FileText className="w-3 h-3 text-[#00B4FF]" /> Parquet Indexing</a></li>
              <li><Link to="/docs" className="hover:text-[#5EE6FF] transition-colors">Vector Store Schema</Link></li>
            </ul>
          </div>

          {/* Scientific Research */}
          <div>
            <h4 className="font-heading font-semibold text-white text-xs uppercase tracking-wider mb-4">Research</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="https://argo.ucsd.edu/" target="_blank" rel="noreferrer" className="hover:text-[#5EE6FF] transition-colors flex items-center gap-1"><Globe className="w-3 h-3" /> ARGO Program</a></li>
              <li><a href="https://incois.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#5EE6FF] transition-colors">INCOIS Data Portal</a></li>
              <li><a href="https://www.ncei.noaa.gov" target="_blank" rel="noreferrer" className="hover:text-[#5EE6FF] transition-colors">NOAA Oceanography</a></li>
              <li><Link to="/about" className="hover:text-[#5EE6FF] transition-colors flex items-center gap-1"><Mail className="w-3 h-3" /> Contact Team</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A8C7D8]">
          <p>© 2026 FloatChat AI Inc. Designed for Ocean Research & Global Discovery.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
