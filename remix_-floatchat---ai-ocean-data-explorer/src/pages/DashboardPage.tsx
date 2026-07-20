import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_ARGO_FLOATS } from '../utils/mockOceanData';
import { LeafletOceanMap } from '../components/interactive/LeafletOceanMap';
import { 
  SlidersHorizontal, MapPin, Activity, Navigation, Filter, 
  Layers, RefreshCw, BarChart2, Calendar, Database, Eye
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area } from 'recharts';

export const DashboardPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [depthFilter, setDepthFilter] = useState<number>(500);
  const [selectedVariable, setSelectedVariable] = useState<'temperature' | 'salinity' | 'oxygen'>('temperature');

  const filteredFloats = MOCK_ARGO_FLOATS.filter(f => selectedRegion === 'All' || f.region === selectedRegion);

  const mapPoints = filteredFloats.map(f => ({
    id: f.id,
    lat: f.latitude,
    lon: f.longitude,
    temp: f.profiles[0].measurements[0].temperature,
    salinity: f.profiles[0].measurements[0].salinity,
    floatId: f.platformNumber
  }));

  const chartData = filteredFloats[0].profiles[0].measurements.filter(m => m.depth <= depthFilter).map(m => ({
    depth: m.depth,
    temperature: m.temperature,
    salinity: m.salinity,
    oxygen: m.oxygen
  }));

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#031B2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Dashboard Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#5EE6FF] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              Live PostGIS Ocean Analytics Feed
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Oceanographic <span className="gradient-ocean-text">Analytics Dashboard</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => { setSelectedRegion('All'); setDepthFilter(2000); }}
              className="px-4 py-2 rounded-xl bg-[#06283D] border border-white/10 text-xs font-mono text-[#A8C7D8] hover:text-white hover:border-[#5EE6FF] transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
            </button>
            <div className="px-4 py-2 rounded-xl bg-[#00B4FF]/20 border border-[#5EE6FF]/40 text-xs font-mono text-[#5EE6FF] flex items-center gap-2">
              <Database className="w-3.5 h-3.5" /> {filteredFloats.length} Active Floats Selected
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
              
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                <SlidersHorizontal className="w-4 h-4 text-[#5EE6FF]" />
                Interactive Parameters & Filters
              </div>

              {/* Region Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#A8C7D8] block">Ocean Region Target</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#06283D] border border-white/15 text-white text-xs focus:border-[#5EE6FF] outline-none"
                >
                  <option value="All">Global / All Regions</option>
                  <option value="Bay of Bengal">Bay of Bengal</option>
                  <option value="Arabian Sea">Arabian Sea</option>
                  <option value="Indian Ocean">Indian Ocean</option>
                </select>
              </div>

              {/* Max Depth Range Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A8C7D8]">Max Depth Scan Limit:</span>
                  <span className="text-[#5EE6FF] font-bold">{depthFilter} meters</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={depthFilter}
                  onChange={(e) => setDepthFilter(Number(e.target.value))}
                  className="w-full accent-[#00B4FF] cursor-pointer"
                />
              </div>

              {/* Primary Variable Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#A8C7D8] block">Primary Parameter</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['temperature', 'salinity', 'oxygen'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariable(v)}
                      className={`py-2 rounded-lg text-[11px] font-mono capitalize transition-all ${
                        selectedVariable === v
                          ? 'bg-[#00B4FF] text-[#031B2E] font-bold shadow-md'
                          : 'bg-white/5 text-[#A8C7D8] hover:text-white'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Telemetry Summary Stats */}
              <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
                <span className="text-white font-heading font-semibold block">Float Inventory Summary</span>
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-[#06283D] border border-white/5">
                    <span className="text-[10px] text-[#A8C7D8]">Avg Surface Temp</span>
                    <span className="block font-bold text-sm text-[#5EE6FF]">29.1°C</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#06283D] border border-white/5">
                    <span className="text-[10px] text-[#A8C7D8]">Avg Salinity</span>
                    <span className="block font-bold text-sm text-[#38BDF8]">34.6 PSU</span>
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* Right Main Dashboard Panel */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Map Section */}
            <div className="space-y-3">
              <LeafletOceanMap
                points={mapPoints}
                center={[12.0, 78.0]}
                zoom={4}
                height="360px"
                title={`Geospatial ARGO Float Trajectories (${selectedRegion})`}
              />
            </div>

            {/* Depth Profile Chart */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Vertical Profile Curve ({selectedVariable.toUpperCase()})
                  </h3>
                  <span className="text-xs font-mono text-[#A8C7D8]">Depth (0–{depthFilter}m) vs {selectedVariable}</span>
                </div>
                <span className="text-xs font-mono text-[#5EE6FF] px-2.5 py-1 rounded bg-[#5EE6FF]/10 border border-[#5EE6FF]/30">
                  ARGO #2902745
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorVar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5EE6FF" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00B4FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="depth" stroke="#A8C7D8" fontSize={10} label={{ value: 'Depth (meters)', position: 'insideBottom', offset: -5, fill: '#A8C7D8', fontSize: 10 }} />
                    <YAxis stroke="#A8C7D8" fontSize={10} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ background: '#031B2E', border: '1px solid #5EE6FF', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Area type="monotone" dataKey={selectedVariable} stroke="#5EE6FF" strokeWidth={2} fillOpacity={1} fill="url(#colorVar)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </main>

        </div>
      </div>
    </div>
  );
};
