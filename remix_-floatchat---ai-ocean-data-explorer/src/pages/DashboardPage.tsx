import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Database, Thermometer, Droplets, Globe, Filter, Search, Download, Clock, Play, FileSpreadsheet, Layers, RefreshCw, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';
import { DashboardService } from '../services/dashboard.service';
import { DashboardMetric, RecentQueryItem, DatasetItem } from '../types/dashboard';
import { ArgoFloat, OceanRegionData } from '../types/ocean';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'floats' | 'datasets' | 'queries'>('overview');
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [recentQueries, setRecentQueries] = useState<RecentQueryItem[]>([]);
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [regions, setRegions] = useState<OceanRegionData[]>([]);
  const [floats, setFloats] = useState<ArgoFloat[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const mRes = await DashboardService.getMetrics();
      const qRes = await DashboardService.getRecentQueries();
      const dRes = await DashboardService.getDatasets();
      const rRes = await DashboardService.getOceanRegions();
      const fRes = await DashboardService.getActiveFloats();

      setMetrics(mRes.data);
      setRecentQueries(qRes.data);
      setDatasets(dRes.data);
      setRegions(rRes.data);
      setFloats(fRes.data);
    };
    fetchDashboardData();
  }, []);

  const getMetricIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio': return <Radio className="w-5 h-5 text-[#00B4FF]" />;
      case 'Database': return <Database className="w-5 h-5 text-[#5EE6FF]" />;
      case 'Thermometer': return <Thermometer className="w-5 h-5 text-amber-400" />;
      case 'Droplet': default: return <Droplets className="w-5 h-5 text-[#38BDF8]" />;
    }
  };

  return (
    <DashboardLayout title="ARGO Ocean Analytics Dashboard">
      <div className="flex flex-col gap-6">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#5EE6FF]/15">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">ARGO Global Ocean Analytics</h1>
              <Badge variant="accent" glowing>Phase 1 Dashboard UI</Badge>
            </div>
            <p className="text-xs text-[#A8C7D8] mt-1 font-mono">
              Monitoring 3,842 active autonomous profilers across global ocean basins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Dropdown
              value={selectedRegion}
              onChange={(val) => setSelectedRegion(val)}
              options={[
                { label: 'All Global Basins', value: 'all' },
                { label: 'Bay of Bengal', value: 'bob' },
                { label: 'Arabian Sea', value: 'as' },
                { label: 'Southern Ocean', value: 'io' },
              ]}
            />
            <Button variant="gradient" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
              Export GeoJSON
            </Button>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.id} variant="glass" className="p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-[#A8C7D8]">{metric.label}</span>
                <div className="w-8 h-8 rounded-lg bg-[#031B2E] border border-[#5EE6FF]/20 flex items-center justify-center">
                  {getMetricIcon(metric.iconName)}
                </div>
              </div>

              <div className="mt-3">
                <span className="text-2xl font-bold font-heading text-white">{metric.value}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono font-bold text-emerald-400">{metric.change}</span>
                  <span className="text-[10px] text-[#A8C7D8] truncate">{metric.description}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Dashboard Main Content Area (Sidebar + Panel Views) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sub-Sidebar Tabs */}
          <div className="lg:col-span-3 flex flex-col gap-2 p-3 rounded-2xl bg-[#06283D]/60 border border-[#5EE6FF]/15 backdrop-blur-xl">
            <span className="text-[10px] font-mono font-bold text-[#A8C7D8] uppercase px-3 py-1">Dashboard Navigation</span>
            {[
              { id: 'overview', label: 'Global Overview', icon: Globe },
              { id: 'floats', label: 'Active ARGO Floats', icon: Radio },
              { id: 'datasets', label: 'Dataset Repository', icon: Database },
              { id: 'queries', label: 'Query Execution Log', icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#00B4FF] text-[#031B2E] font-bold shadow-md shadow-[#00B4FF]/30'
                      : 'text-[#A8C7D8] hover:text-white hover:bg-[#5EE6FF]/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}

            <div className="mt-6 pt-4 border-t border-[#5EE6FF]/10 px-3">
              <span className="text-[10px] font-mono text-[#A8C7D8]">Phase 2 Live Telemetry Status:</span>
              <div className="mt-1 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Parquet Cache Active</span>
              </div>
            </div>
          </div>

          {/* Right Main Dashboard Panel */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                {/* Ocean Map Panel Placeholder */}
                <Card variant="solid" className="p-6 bg-[#06283D]/80 border-[#5EE6FF]/20 relative overflow-hidden min-h-[340px] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-[#5EE6FF]/15 pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#00B4FF]" />
                      <h3 className="text-base font-bold font-heading text-white">Global ARGO Spatial Distribution Map</h3>
                    </div>
                    <Badge variant="accent" size="sm">Leaflet Preview</Badge>
                  </div>

                  {/* Visual Map Representation */}
                  <div className="my-6 relative w-full h-56 rounded-2xl bg-[#031B2E] border border-[#5EE6FF]/20 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-grid-pattern opacity-40" />
                    <div className="absolute inset-0 bg-radial-ocean opacity-50" />

                    {/* Simulated Floating Markers */}
                    {floats.map((fl, i) => (
                      <motion.div
                        key={fl.id}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3 + i, repeat: Infinity }}
                        style={{ left: `${20 + i * 18}%`, top: `${30 + (i % 3) * 20}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                      >
                        <div className="w-4 h-4 rounded-full bg-[#00B4FF] border-2 border-white shadow-[0_0_12px_#00B4FF] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        </div>
                        <div className="hidden group-hover:flex flex-col p-2 rounded-lg bg-[#06283D] border border-[#5EE6FF]/30 text-[10px] font-mono text-white shadow-xl z-20 whitespace-nowrap mt-1">
                          <span className="font-bold">WMO #{fl.wmoId}</span>
                          <span>{fl.temperature}°C • {fl.salinity} PSU</span>
                        </div>
                      </motion.div>
                    ))}

                    <span className="relative z-10 text-xs font-mono text-[#A8C7D8] bg-[#031B2E]/80 px-4 py-2 rounded-xl border border-[#5EE6FF]/20">
                      Interactive Leaflet Map — Real-time Buoy Positions
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-[#A8C7D8]">
                    <span>Latitude Bounds: -60°S to +60°N</span>
                    <span>Longitude Bounds: -180°W to +180°E</span>
                  </div>
                </Card>

                {/* Ocean Region Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {regions.map((reg) => (
                    <Card key={reg.id} variant="glass" className="p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white font-heading">{reg.name}</span>
                        <Badge variant="highlight" size="sm">{reg.floatCount} Floats</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#5EE6FF]/10 text-xs font-mono">
                        <div>
                          <span className="text-[#A8C7D8] block text-[10px]">Avg Temperature</span>
                          <span className="text-white font-bold">{reg.avgTemp} °C</span>
                        </div>
                        <div>
                          <span className="text-[#A8C7D8] block text-[10px]">Avg Salinity</span>
                          <span className="text-[#5EE6FF] font-bold">{reg.avgSalinity} PSU</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'floats' && (
              <Card variant="solid" className="p-6 bg-[#06283D]/80 border-[#5EE6FF]/20 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-heading text-white">Active ARGO Floats Telemetry</h3>
                  <Badge variant="success">3,842 Operational</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#5EE6FF]/20 text-[#A8C7D8]">
                        <th className="py-2.5 px-3">WMO ID</th>
                        <th className="py-2.5 px-3">Region</th>
                        <th className="py-2.5 px-3">Lat / Lon</th>
                        <th className="py-2.5 px-3">Temp (°C)</th>
                        <th className="py-2.5 px-3">Salinity (PSU)</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {floats.map((fl) => (
                        <tr key={fl.id} className="border-b border-[#5EE6FF]/10 hover:bg-[#5EE6FF]/5">
                          <td className="py-2.5 px-3 font-bold text-white">#{fl.wmoId}</td>
                          <td className="py-2.5 px-3 text-[#A8C7D8]">{fl.oceanRegion}</td>
                          <td className="py-2.5 px-3 text-[#5EE6FF]">{fl.latitude}°, {fl.longitude}°</td>
                          <td className="py-2.5 px-3 text-white">{fl.temperature} °C</td>
                          <td className="py-2.5 px-3 text-[#A8C7D8]">{fl.salinity} PSU</td>
                          <td className="py-2.5 px-3">
                            <Badge variant={fl.status === 'active' ? 'success' : 'outline'} size="sm">
                              {fl.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {activeTab === 'datasets' && (
              <Card variant="solid" className="p-6 bg-[#06283D]/80 border-[#5EE6FF]/20 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-heading text-white">Subsetted Parquet & netCDF Datasets</h3>
                  <Badge variant="accent">Open Science</Badge>
                </div>
                <div className="flex flex-col gap-3">
                  {datasets.map((ds) => (
                    <div key={ds.id} className="p-4 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/15 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#00B4FF]/10 border border-[#00B4FF]/30 flex items-center justify-center">
                          <FileSpreadsheet className="w-5 h-5 text-[#00B4FF]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{ds.name}</h4>
                          <span className="text-xs text-[#A8C7D8] font-mono">{ds.records} Records • {ds.fileSize} • Format: {ds.format}</span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'queries' && (
              <Card variant="solid" className="p-6 bg-[#06283D]/80 border-[#5EE6FF]/20 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-heading text-white">Recent Query Execution Log</h3>
                  <Badge variant="highlight">Text-to-SQL Audit</Badge>
                </div>
                <div className="flex flex-col gap-3">
                  {recentQueries.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/15 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-white">"{q.query}"</span>
                        <Badge variant="success" size="sm">{q.executionTime}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-[#A8C7D8]">
                        <span>Executed {q.timestamp}</span>
                        <span>Region: {q.region}</span>
                        <span>{q.recordsCount} Rows Evaluated</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
