import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { SEOHead } from '../components/common/SEOHead';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title = 'Analytics Dashboard' }) => {
  return (
    <div className="min-h-screen bg-[#031B2E] text-white flex flex-col selection:bg-[#00B4FF]/30 selection:text-[#5EE6FF]">
      <SEOHead title={title} />
      <Navbar />
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] w-full mx-auto pb-12">
        {children}
      </main>
    </div>
  );
};
