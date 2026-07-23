import React from 'react';
import { Link } from 'react.router-dom';
import { Waves, Github, Twitter, MessageSquare, ExternalLink, CheckCircle } from 'lucide-react';
import { APP_CONFIG } from '../../config/app';
import { FOOTER_LINKS } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#031B2E] border-t border-[#5EE6FF]/15 relative overflow-hidden pt-16 pb-12">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-b from-[#00B4FF]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#5EE6FF]/10">
          {/* Brand info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00B4FF] flex items-center justify-center shadow-lg shadow-[#00B4FF]/30">
                <Waves className="w-6 h-6 text-[#031B2E]" />
              </div>
              <span className="text-2xl font-bold font-heading text-white">{APP_CONFIG.name}</span>
            </Link>
            <p className="text-sm text-[#A8C7D8] max-w-sm font-normal leading-relaxed">
              {APP_CONFIG.description}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {APP_CONFIG.systemStatus.label}
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Product</h4>
            {FOOTER_LINKS.product.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="text-xs text-[#A8C7D8] hover:text-[#5EE6FF] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Resources</h4>
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

          {/* Legal / Social */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Connect</h4>
            <div className="flex items-center gap-3">
              <a
                href={APP_CONFIG.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#06283D] border border-[#5EE6FF]/20 flex items-center justify-center text-[#A8C7D8] hover:text-white hover:border-[#00B4FF] transition-all"
                aria-label="GitHub repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={APP_CONFIG.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#06283D] border border-[#5EE6FF]/20 flex items-center justify-center text-[#A8C7D8] hover:text-white hover:border-[#00B4FF] transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={APP_CONFIG.socials.discord}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#06283D] border border-[#5EE6FF]/20 flex items-center justify-center text-[#A8C7D8] hover:text-white hover:border-[#00B4FF] transition-all"
                aria-label="Discord"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
            <span className="text-[11px] text-[#A8C7D8]">ARGO Ocean Data • Open Science</span>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8C7D8]">
          <p>© {new Date().getFullYear()} FloatChat AI. All rights reserved.</p>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Phase 1 Frontend</span>
            <span>React 19 + TypeScript</span>
            <span>Dark Mode Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
