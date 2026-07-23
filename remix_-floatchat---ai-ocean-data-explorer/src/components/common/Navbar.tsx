import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react.router-dom';
import { Waves, Menu, X, Sparkles, Terminal } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#031B2E]/80 backdrop-blur-xl border-b border-[#5EE6FF]/15 shadow-2xl py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00B4FF] to-[#06283D] p-0.5 shadow-lg shadow-[#00B4FF]/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#031B2E] rounded-[10px] flex items-center justify-center">
              <Waves className="w-5 h-5 text-[#5EE6FF] group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-heading tracking-tight text-white group-hover:text-[#5EE6FF] transition-colors">
                FloatChat
              </span>
              <Badge variant="accent" size="sm" glowing>AI</Badge>
            </div>
            <span className="text-[10px] text-[#A8C7D8] font-mono tracking-wider uppercase -mt-0.5">Talk to the Ocean</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#06283D]/60 p-1.5 rounded-full border border-[#5EE6FF]/15 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'text-white bg-[#00B4FF]/20 border border-[#00B4FF]/40 shadow-sm shadow-[#00B4FF]/20'
                    : 'text-[#A8C7D8] hover:text-white hover:bg-[#5EE6FF]/10'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to={ROUTES.DEMO}>
            <Button variant="gradient" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Launch FloatChat
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[#A8C7D8] hover:text-white bg-[#06283D] border border-[#5EE6FF]/20"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#031B2E]/95 border-b border-[#5EE6FF]/20 backdrop-blur-2xl px-6 py-6 flex flex-col gap-4 animate-fadeIn">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-between ${
                location.pathname === item.path
                  ? 'text-[#5EE6FF] bg-[#00B4FF]/10 border border-[#00B4FF]/30'
                  : 'text-[#A8C7D8] hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && <Badge variant="phase2" size="sm">{item.badge}</Badge>}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#5EE6FF]/10">
            <Link to={ROUTES.DEMO} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="gradient" size="md" className="w-full" leftIcon={<Sparkles className="w-4 h-4" />}>
                Launch FloatChat Demo
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
