import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollBlur } from '../../hooks/useScrollBlur';
import { Waves, Sparkles, Terminal, Compass, BookOpen, Info, Menu, X, ArrowRight, Activity } from 'lucide-react';

export const Navbar: React.FC = () => {
  const isScrolled = useScrollBlur(20);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Waves },
    { name: 'Features', path: '/#features', icon: Compass },
    { name: 'Architecture', path: '/docs', icon: Terminal },
    { name: 'Demo', path: '/demo', icon: Sparkles },
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#031B2E]/75 backdrop-blur-xl border-b border-[#5EE6FF]/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#00B4FF] to-[#06283D] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,180,255,0.4)] group-hover:shadow-[0_0_25px_rgba(94,230,255,0.6)] transition-all duration-300">
            <div className="w-full h-full bg-[#031B2E] rounded-[10px] flex items-center justify-center">
              <Waves className="w-5 h-5 text-[#5EE6FF] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
              FloatChat <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00B4FF]/20 text-[#5EE6FF] border border-[#5EE6FF]/30">AI</span>
            </span>
            <span className="text-[10px] font-mono text-[#A8C7D8] tracking-widest uppercase -mt-0.5">ARGO Ocean AI</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#06283D]/50 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path.startsWith('/#') && location.pathname === '/');
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00B4FF]/20 to-[#5EE6FF]/10 text-[#5EE6FF] border border-[#5EE6FF]/30 shadow-[0_0_15px_rgba(94,230,255,0.2)]'
                    : 'text-[#A8C7D8] hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/demo"
            className="text-xs font-semibold px-4 py-2.5 rounded-xl text-[#A8C7D8] hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            Sign In
          </Link>
          <Link
            to="/demo"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00B4FF] to-[#38BDF8] text-[#031B2E] font-heading font-bold text-xs shadow-[0_0_20px_rgba(0,180,255,0.4)] hover:shadow-[0_0_30px_rgba(94,230,255,0.7)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Demo</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-[#06283D] border border-white/10 text-[#A8C7D8] hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#031B2E]/95 backdrop-blur-2xl border-b border-[#5EE6FF]/20 px-4 pt-4 pb-6 mt-3 space-y-3">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-[#A8C7D8] hover:text-white hover:bg-[#06283D] flex items-center gap-3 border border-transparent hover:border-white/10"
              >
                <link.icon className="w-4 h-4 text-[#5EE6FF]" />
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#00B4FF] to-[#38BDF8] text-[#031B2E] font-heading font-bold text-sm"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
