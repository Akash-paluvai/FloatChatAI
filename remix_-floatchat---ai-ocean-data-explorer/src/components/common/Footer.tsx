import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, GitBranch, Globe, ExternalLink, Activity, Database, FileSpreadsheet, ShieldCheck, Terminal } from 'lucide-react';
import { APP_CONFIG } from '../../config/app';
import { FOOTER_LINKS } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#031B2E] border-t border-[#5EE6FF]/15 relative overflow-hidden pt-14 pb-10">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[220px] bg-gradient-to-b from-[#00B4FF]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-10 border-b border-[#5EE6FF]/10">
          {/* Brand info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#00B4FF] flex items-center justify-center shadow-lg shadow-[#00B4FF]/30 group-hover:scale-105 transition-transform">
                <Waves className="w-6 h-6 text-[#031B2E]" />
              </div>
              <div>
                <span className="text-2xl font-bold font-heading text-white tracking-tight">{APP_CONFIG.name}</span>
                <span className="text-[10px] font-mono text-[#5EE6FF] block -mt-1">v{APP_CONFIG.version}</span>
              </div>
            </Link>
            <p className="text-xs text-[#A8C7D8] max-w-sm leading-relaxed">
              {APP_CONFIG.description}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {APP_CONFIG.systemStatus.label}
              </div>
            </div>
          </div>

          {/* Product Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Platform Tools</h4>
            {FOOTER_LINKS.product.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="text-xs text-[#A8C7D8] hover:text-[#5EE6FF] transition-colors flex items-center gap-1.5"
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Scientific Resources */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Resources & Specs</h4>
            {FOOTER_LINKS.company.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="text-xs text-[#A8C7D8] hover:text-[#5EE6FF] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Connect & GitHub Repo */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Open Source</h4>
            <div className="flex flex-col gap-2">
              <a
                href={APP_CONFIG.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06283D] border border-[#5EE6FF]/20 text-xs text-white hover:text-[#5EE6FF] hover:border-[#00B4FF] transition-all w-fit"
              >
                <GitBranch className="w-4 h-4 text-[#00B4FF]" />
                <span className="font-mono text-[11px]">GitHub Repository</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <span className="text-[10px] text-[#A8C7D8] font-mono leading-relaxed mt-1">
                Data Sourced from ARGO Global Data Assembly Center (GDAC)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8C7D8]">
          <p className="text-[11px]">
            © {new Date().getFullYear()} <span className="text-white font-bold">{APP_CONFIG.name} AI</span>. Open Science Oceanographic Explorer.
          </p>
          <div className="flex items-center gap-4 font-mono text-[10px] text-[#5EE6FF]">
            <span className="flex items-center gap-1.5"><Database className="w-3 h-3 text-[#00B4FF]" /> 54M Observations</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><FileSpreadsheet className="w-3 h-3 text-[#00B4FF]" /> 36 Parquet Archives</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Real Data Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
