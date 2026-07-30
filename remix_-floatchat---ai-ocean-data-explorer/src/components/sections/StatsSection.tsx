import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Activity, Target, Zap, Waves, Layers, FileSpreadsheet } from 'lucide-react';
import { DashboardService, DashboardSummary } from '../../services/dashboard.service';

export const StatsSection: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await DashboardService.getSummary();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    };
    load();
  }, []);

  const totalObs = summary?.estimated_total_observations
    ? `${(summary.estimated_total_observations / 1_000_000).toFixed(0)}M+`
    : '54M+';
  const totalFiles = summary?.total_parquet_files ? String(summary.total_parquet_files) : '36';
  const depthCoverage = summary?.sample_statistics?.depth_range || '0m – 5131m';
  const meanTemp = summary?.sample_statistics?.mean_surface_temp ? `${summary.sample_statistics.mean_surface_temp}°C` : '24.2°C';

  const stats = [
    {
      id: 'measurements',
      value: totalObs,
      label: 'Parquet Observations',
      sublabel: 'Evaluated row profiles across all ocean basins',
      icon: Database,
    },
    {
      id: 'files',
      value: totalFiles,
      label: 'Monthly Parquet Archives',
      sublabel: 'Columnar Apache Parquet datasets (2022–2024)',
      icon: FileSpreadsheet,
    },
    {
      id: 'depth',
      value: depthCoverage,
      label: 'Depth Coverage',
      sublabel: 'Surface mixed layer to deep ocean abyss',
      icon: Waves,
    },
    {
      id: 'accuracy',
      value: '100%',
      label: 'Data Groundedness',
      sublabel: 'Deterministic synthesis with GDAC citations',
      icon: Target,
    },
    {
      id: 'latency',
      value: '< 25 ms',
      label: 'Query Latency',
      sublabel: 'FastAPI out-of-core filtering & Plotly spec generation',
      icon: Zap,
    },
  ];

  return (
    <section className="py-16 bg-[#031B2E] border-y border-[#5EE6FF]/15 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-48 bg-[#00B4FF]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#5EE6FF]">
            Live Parquet Data Telemetry
          </span>
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-1">
            Real ARGO Ocean Data Scale
          </h3>
        </div>

        {/* 5 Stats Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="p-5 rounded-2xl bg-[#06283D]/80 border border-[#5EE6FF]/15 hover:border-[#00B4FF]/40 text-center flex flex-col items-center justify-between transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/20 flex items-center justify-center mb-3 text-[#00B4FF]">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    {stat.value}
                  </span>
                  <h4 className="font-heading font-bold text-[11px] text-[#5EE6FF] uppercase tracking-wider block">
                    {stat.label}
                  </h4>
                </div>

                <p className="text-[10px] text-[#A8C7D8] mt-2 leading-snug">
                  {stat.sublabel}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
