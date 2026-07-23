import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { SEOHead } from '../components/common/SEOHead';

export interface DocumentationLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({ children, title = 'Documentation' }) => {
  return (
    <div className="min-h-screen bg-[#031B2E] text-white flex flex-col selection:bg-[#00B4FF]/30 selection:text-[#5EE6FF]">
      <SEOHead title={title} />
      <Navbar />
      <main className="flex-1 pt-24 pb-16">{children}</main>
      <Footer />
    </div>
  );
};
