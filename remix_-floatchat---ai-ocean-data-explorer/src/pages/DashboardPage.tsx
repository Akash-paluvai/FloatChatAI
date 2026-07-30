import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  Database, Thermometer, Droplets, Globe, Download, Layers, Radio,
  BarChart3, Map, Clock, ArrowRight, Activity, Waves, FileSpreadsheet, ChevronDown
} from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { DashboardService, DashboardSummary, RegionStats } from '../services/dashboard.service';

const Plot = lazy(() => import('react-plotly.js'));

const DARK_LAYOUT: Record<string, unknown> = {
  paper_bgcolor: 'rgba(3,27,46,0.95)',
  plot_bgcolor: 'rgba(6,40,61,0.9)',
  font: { color: '#A8C7D8', family: 'Inter, sans-serif', size: 11 },
  margin: { t: 36, r: 16, b: 40, l: 50 },
  xaxis: { gridcolor: 'rgba(94,230,255,0.08)' },
  yaxis: { gridcolor: 'rgba(94,230,255,0.08)' },
};

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionStats, setRegionStats] = useState<RegionStats | null>(null);
  const [regionLoading, setRegionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'datasets' | 'regions'>('overview');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await DashboardService.getSummary();
      setSummary(res.data);
      setLoading(false);
    };
    load();
  }, []);

  const handleRegionClick = async (regionName: string) => {
    setSelectedRegion(regionName);
    setRegionLoading(true);
    const res = await DashboardService.getRegionStats(regionName);
    setRegionStats(res.data);
    setRegionLoading(false);
  };

  if (loading || !summary) {
    return (
      <MainLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  const s = summary.sample_statistics;
  const bounds = summary.spatial_bounds;

  // Build dataset size chart data
  const dsNames = summary.datasets.map(d => {
    const parts = d.file_name.replace('_MINIMAL.parquet', '').split('_');
    return `${parts[0]}-${parts[1]}`;
  });
  const dsSizes = summary.datasets.map(d => d.size_mb);

  return (
    <MainLayout title="ARGO Ocean Analytics Dashboard">
      <div className="py-6">
        <Container size="xl" className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#5EE6FF]/15">
            <div>
              <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
                <Globe className="w-7 h-7 text-[#00B4FF]" />
                ARGO Ocean Data Dashboard
              </h1>
              <p className="text-xs text-[#A8C7D8] mt-1">
                Live analytics from {summary.total_parquet_files} parquet files • {summary.source}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" glowing icon={<Database className="w-3 h-3" />}>
                {summary.estimated_total_observations.toLocaleString()} Observations
              </Badge>
              <Badge variant="accent" icon={<Clock className="w-3 h-3" />}>
                {summary.data_format}
              </Badge>
            </div>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <MetricCard
              icon={<Database className="w-5 h-5 text-[#00B4FF]" />}
              label="Parquet Files"
              value={String(summary.total_parquet_files)}
              detail="Monthly ARGO archives"
            />
            <MetricCard
              icon={<Layers className="w-5 h-5 text-[#5EE6FF]" />}
              label="Total Observations"
              value={`${(summary.estimated_total_observations / 1_000_000).toFixed(0)}M`}
              detail="Across all months"
            />
            <MetricCard
              icon={<Thermometer className="w-5 h-5 text-amber-400" />}
              label="Surface Temp"
              value={s.mean_surface_temp ? `${s.mean_surface_temp}°C` : '—'}
              detail={`Sample: ${s.sample_file || '—'}`}
            />
            <MetricCard
              icon={<Droplets className="w-5 h-5 text-[#38BDF8]" />}
              label="Mean Salinity"
              value={s.mean_salinity ? `${s.mean_salinity} PSU` : '—'}
              detail="From sample file"
            />
            <MetricCard
              icon={<Activity className="w-5 h-5 text-emerald-400" />}
              label="Max Depth"
              value={s.depth_range || '—'}
              detail={`${s.unique_positions?.toLocaleString()} unique positions`}
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#06283D]/60 border border-[#5EE6FF]/15 w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'datasets', label: 'Datasets', icon: FileSpreadsheet },
              { id: 'regions', label: 'Region Explorer', icon: Map },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#00B4FF] text-[#031B2E] font-bold shadow-md'
                      : 'text-[#A8C7D8] hover:text-white hover:bg-[#5EE6FF]/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Spatial Coverage Card */}
              <Card variant="solid" className="p-5 bg-[#06283D]/80 border-[#5EE6FF]/15">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#5EE6FF]/10">
                  <Globe className="w-4 h-4 text-[#00B4FF]" />
                  <h3 className="text-sm font-bold text-white">Spatial Coverage</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#031B2E] border border-[#5EE6FF]/10">
                    <span className="text-[9px] text-[#A8C7D8] uppercase">Latitude Range</span>
                    <p className="text-white font-bold mt-1">{bounds.lat_min}° to {bounds.lat_max}°</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#031B2E] border border-[#5EE6FF]/10">
                    <span className="text-[9px] text-[#A8C7D8] uppercase">Longitude Range</span>
                    <p className="text-white font-bold mt-1">{bounds.lon_min}° to {bounds.lon_max}°</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#031B2E] border border-[#5EE6FF]/10">
                    <span className="text-[9px] text-[#A8C7D8] uppercase">Time Start</span>
                    <p className="text-[#5EE6FF] font-bold mt-1">{summary.time_range.start.slice(0, 10)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#031B2E] border border-[#5EE6FF]/10">
                    <span className="text-[9px] text-[#A8C7D8] uppercase">Time End</span>
                    <p className="text-[#5EE6FF] font-bold mt-1">{summary.time_range.end.slice(0, 10)}</p>
                  </div>
                </div>
              </Card>

              {/* Dataset Size Distribution Chart */}
              <Card variant="solid" className="p-5 bg-[#06283D]/80 border-[#5EE6FF]/15">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#5EE6FF]/10">
                  <BarChart3 className="w-4 h-4 text-[#00B4FF]" />
                  <h3 className="text-sm font-bold text-white">Dataset Size by Month</h3>
                </div>
                <Suspense fallback={<div className="h-52 flex items-center justify-center"><Spinner size="md" /></div>}>
                  <Plot
                    data={[{
                      x: dsNames,
                      y: dsSizes,
                      type: 'bar',
                      marker: {
                        color: dsSizes.map((_, i) => {
                          const hue = 190 + (i / dsSizes.length) * 30;
                          return `hsl(${hue}, 80%, 55%)`;
                        }),
                        line: { width: 0 }
                      },
                      hovertemplate: '%{x}<br>%{y:.1f} MB<extra></extra>',
                    }]}
                    layout={{
                      ...DARK_LAYOUT,
                      autosize: true,
                      yaxis: { ...DARK_LAYOUT.yaxis as any, title: 'Size (MB)' },
                      xaxis: { ...DARK_LAYOUT.xaxis as any, tickangle: -45 },
                      bargap: 0.15,
                    }}
                    config={{ responsive: true, displayModeBar: false }}
                    useResizeHandler
                    style={{ width: '100%', height: 250 }}
                  />
                </Suspense>
              </Card>

              {/* Region Quick Cards */}
              <Card variant="solid" className="p-5 bg-[#06283D]/80 border-[#5EE6FF]/15 lg:col-span-2">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#5EE6FF]/10">
                  <Map className="w-4 h-4 text-[#5EE6FF]" />
                  <h3 className="text-sm font-bold text-white">Ocean Regions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {summary.regions.map(region => (
                    <motion.button
                      key={region.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setActiveTab('regions'); handleRegionClick(region.name); }}
                      className="p-4 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/15 hover:border-[#00B4FF]/40 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Waves className="w-4 h-4 text-[#00B4FF]" />
                        <ArrowRight className="w-3.5 h-3.5 text-[#A8C7D8] group-hover:text-[#00B4FF] transition-colors" />
                      </div>
                      <h4 className="text-sm font-bold text-white">{region.name}</h4>
                      <p className="text-[10px] text-[#A8C7D8] mt-1 leading-relaxed">{region.description}</p>
                      <p className="text-[9px] text-[#5EE6FF]/60 font-mono mt-2">
                        {region.bbox[0]}°–{region.bbox[2]}°N, {region.bbox[1]}°–{region.bbox[3]}°E
                      </p>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'datasets' && (
            <Card variant="solid" className="p-5 bg-[#06283D]/80 border-[#5EE6FF]/15">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#5EE6FF]/10">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#00B4FF]" />
                  <h3 className="text-sm font-bold text-white">ARGO Parquet Dataset Repository</h3>
                </div>
                <Badge variant="accent">{summary.datasets.length} Files</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#5EE6FF]/15 text-[#A8C7D8]">
                      <th className="py-2.5 px-3">File</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Lat Range</th>
                      <th className="py-2.5 px-3">Lon Range</th>
                      <th className="py-2.5 px-3">Time Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.datasets.map((ds, i) => (
                      <tr key={i} className="border-b border-[#5EE6FF]/8 hover:bg-[#5EE6FF]/5 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-white">{ds.file_name}</td>
                        <td className="py-2.5 px-3 text-[#5EE6FF]">{ds.size_mb} MB</td>
                        <td className="py-2.5 px-3 text-[#A8C7D8]">{ds.lat_range.split(' – ').map(v => Number(v).toFixed(1)).join('° to ')}°</td>
                        <td className="py-2.5 px-3 text-[#A8C7D8]">{ds.lon_range.split(' – ').map(v => Number(v).toFixed(1)).join('° to ')}°</td>
                        <td className="py-2.5 px-3 text-[#A8C7D8]">{ds.time_range.split(' – ').map(t => t.slice(0, 10)).join(' → ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-[#A8C7D8] pt-3 border-t border-[#5EE6FF]/10">
                <span>Total size: {summary.datasets.reduce((acc, d) => acc + d.size_mb, 0).toFixed(1)} MB</span>
                <span>Format: {summary.data_format}</span>
              </div>
            </Card>
          )}

          {activeTab === 'regions' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Region Selector */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Map className="w-4 h-4 text-[#5EE6FF]" />
                  Select a Region
                </h3>
                {summary.regions.map(region => (
                  <button
                    key={region.name}
                    onClick={() => handleRegionClick(region.name)}
                    className={`p-3 rounded-xl text-left transition-all text-xs ${
                      selectedRegion === region.name
                        ? 'bg-[#00B4FF] text-[#031B2E] font-bold shadow-md shadow-[#00B4FF]/30'
                        : 'bg-[#06283D]/80 text-[#A8C7D8] border border-[#5EE6FF]/15 hover:border-[#00B4FF]/40'
                    }`}
                  >
                    <span className="font-bold block">{region.name}</span>
                    <span className="text-[10px] opacity-80">{region.description}</span>
                  </button>
                ))}
              </div>

              {/* Region Stats Panel */}
              <div className="lg:col-span-2">
                {!selectedRegion && (
                  <Card variant="solid" className="p-8 bg-[#06283D]/60 border-[#5EE6FF]/10 flex flex-col items-center justify-center min-h-[300px]">
                    <Map className="w-10 h-10 text-[#5EE6FF]/30 mb-3" />
                    <p className="text-sm text-[#A8C7D8]">Select a region to view real-time statistics</p>
                  </Card>
                )}

                {selectedRegion && regionLoading && (
                  <Card variant="solid" className="p-8 bg-[#06283D]/60 border-[#5EE6FF]/10 flex items-center justify-center min-h-[300px]">
                    <Spinner size="lg" />
                    <span className="ml-3 text-sm text-[#A8C7D8]">Loading {selectedRegion} data from parquet files...</span>
                  </Card>
                )}

                {selectedRegion && !regionLoading && regionStats && (
                  <Card variant="solid" className="p-5 bg-[#06283D]/80 border-[#5EE6FF]/15">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#5EE6FF]/10">
                      <h3 className="text-base font-bold text-white">{selectedRegion} — Live Statistics</h3>
                      <Badge variant="success" size="sm">Real Data</Badge>
                    </div>

                    {regionStats.total_observations === 0 ? (
                      <p className="text-sm text-[#A8C7D8]">No observations found for this region in the current dataset.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {regionStats.total_observations != null && (
                          <StatBox label="Observations" value={regionStats.total_observations.toLocaleString()} />
                        )}
                        {regionStats.avg_temp && <StatBox label="Mean Temp" value={regionStats.avg_temp} color="text-[#00B4FF]" />}
                        {regionStats.min_temp && regionStats.max_temp && (
                          <StatBox label="Temp Range" value={`${regionStats.min_temp} – ${regionStats.max_temp}`} />
                        )}
                        {regionStats.depth_range && <StatBox label="Depth Range" value={regionStats.depth_range} />}
                        {regionStats.thermocline_gradient_depth && (
                          <StatBox label="Thermocline" value={regionStats.thermocline_gradient_depth} color="text-emerald-400" />
                        )}
                        {regionStats.spatial_centroid && <StatBox label="Centroid" value={regionStats.spatial_centroid} />}
                        {regionStats.time_range && <StatBox label="Time Period" value={regionStats.time_range} />}
                      </div>
                    )}
                  </Card>
                )}
              </div>
            </div>
          )}
        </Container>
      </div>
    </MainLayout>
  );
};

/* ─── Helper Components ─── */
const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string; detail: string }> = ({ icon, label, value, detail }) => (
  <Card variant="glass" className="p-4 flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-mono font-medium text-[#A8C7D8] uppercase tracking-wider">{label}</span>
      <div className="w-8 h-8 rounded-lg bg-[#031B2E] border border-[#5EE6FF]/20 flex items-center justify-center">{icon}</div>
    </div>
    <div className="mt-3">
      <span className="text-2xl font-bold font-heading text-white">{value}</span>
      <p className="text-[10px] text-[#A8C7D8] mt-0.5 truncate">{detail}</p>
    </div>
  </Card>
);

const StatBox: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div className="p-3 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/12">
    <span className="text-[9px] font-mono text-[#A8C7D8] uppercase tracking-wider">{label}</span>
    <span className={`text-sm font-bold block mt-0.5 ${color || 'text-white'}`}>{value}</span>
  </div>
);
