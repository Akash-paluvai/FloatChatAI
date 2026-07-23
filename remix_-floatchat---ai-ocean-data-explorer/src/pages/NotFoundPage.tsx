import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, Home, Compass } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <MainLayout title="404 — Ocean Coordinates Not Found">
      <div className="min-h-[70vh] flex items-center justify-center py-16">
        <Container size="sm" className="text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-[#00B4FF]/10 border border-[#00B4FF]/30 flex items-center justify-center shadow-2xl shadow-[#00B4FF]/20 animate-pulse">
            <Waves className="w-10 h-10 text-[#00B4FF]" />
          </div>

          <div>
            <span className="text-5xl font-extrabold font-mono text-[#5EE6FF]">404</span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-2">
              Uncharted Ocean Territory
            </h1>
            <p className="text-xs sm:text-sm text-[#A8C7D8] max-w-md mt-2 leading-relaxed">
              The ARGO depth coordinates or route you requested do not exist in our spatial index.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link to={ROUTES.HOME}>
              <Button variant="gradient" size="md" leftIcon={<Home className="w-4 h-4" />}>
                Return to Home
              </Button>
            </Link>
            <Link to={ROUTES.DEMO}>
              <Button variant="secondary" size="md" leftIcon={<Compass className="w-4 h-4" />}>
                Launch Demo
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};
