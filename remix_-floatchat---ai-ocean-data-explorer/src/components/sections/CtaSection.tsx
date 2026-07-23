import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00B4FF]/10 to-transparent pointer-events-none" />

      <Container size="lg" className="relative z-10">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-[#06283D] via-[#031B2E] to-[#06283D] border border-[#00B4FF]/40 text-center flex flex-col items-center gap-6 shadow-2xl shadow-[#00B4FF]/20 relative overflow-hidden">
          {/* Subtle grid pattern background overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center gap-4 max-w-2xl"
          >
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#00B4FF]/20 text-[#5EE6FF] border border-[#00B4FF]/40">
              Start Exploring Today
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              Ready to Explore the Ocean?
            </h2>

            <p className="text-base sm:text-lg text-[#A8C7D8] font-normal leading-relaxed">
              Experience the power of natural language query translation over ARGO oceanographic data with FloatChat.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to={ROUTES.DEMO}>
                <Button
                  variant="gradient"
                  size="lg"
                  leftIcon={<Sparkles className="w-5 h-5" />}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Launch FloatChat
                </Button>
              </Link>
              <Link to={ROUTES.DOCS}>
                <Button variant="secondary" size="lg" leftIcon={<Compass className="w-5 h-5" />}>
                  View Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
