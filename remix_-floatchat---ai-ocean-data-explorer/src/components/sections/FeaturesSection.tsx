import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Compass, BarChart3, Radio, Cpu, Download } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { Card } from '../ui/Card';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Natural Language Search',
      description: 'Ask complex oceanographic questions in plain English. No SQL or netCDF programming required.',
      badge: 'Text-to-SQL',
    },
    {
      icon: Compass,
      title: 'Ocean Data Discovery',
      description: 'Seamlessly query global ocean basins, thermocline boundaries, and regional salinity gradients.',
      badge: 'Global Spatial',
    },
    {
      icon: BarChart3,
      title: 'Interactive Visualizations',
      description: 'Render instant 2D/3D depth profiles, thermocline plots, and spatial heatmaps.',
      badge: 'Plotly Graphing',
    },
    {
      icon: Radio,
      title: 'ARGO Float Tracking',
      description: 'Monitor real-time trajectories and telemetry status for over 3,800 active autonomous buoys.',
      badge: 'Live Telemetry',
    },
    {
      icon: Cpu,
      title: 'Scientific Analytics',
      description: 'Calculate ocean heat content, density layers, and climate anomaly patterns automatically.',
      badge: 'RAG Analytics',
    },
    {
      icon: Download,
      title: 'Research Export',
      description: 'Export subsetted observations directly into CSV, Parquet, or GeoJSON for academic publication.',
      badge: 'Data Pipeline',
    },
  ];

  return (
    <section id="features" className="py-20 relative">
      <Container size="lg">
        <SectionTitle
          badgeText="Capabilities"
          title="Designed for Ocean Science & AI Exploration"
          subtitle="Everything you need to interrogate millions of ARGO float records in seconds."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card variant="glass" className="h-full flex flex-col justify-between group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#00B4FF]/10 border border-[#00B4FF]/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00B4FF] transition-all">
                        <Icon className="w-6 h-6 text-[#00B4FF] group-hover:text-[#031B2E] transition-colors" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#06283D] border border-[#5EE6FF]/20 text-[#5EE6FF]">
                        {feat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold font-heading text-white group-hover:text-[#5EE6FF] transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-[#A8C7D8] font-normal leading-relaxed mt-2">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
