import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Cpu, Network, FileCode, Layers, Shield, ChevronRight, Copy, Check } from 'lucide-react';

export const DocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'rag' | 'mcp' | 'api'>('overview');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#031B2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06283D] border border-[#5EE6FF]/30 text-[#5EE6FF] text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            Developer & Scientific Documentation
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            System <span className="gradient-ocean-text">Architecture & Specifications</span>
          </h1>
          <p className="text-[#A8C7D8] text-base font-light">
            Detailed technical breakdown of FloatChat’s RAG pipeline, Model Context Protocol (MCP) server, and PostGIS database schema.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'overview', label: 'System Overview' },
            { id: 'schema', label: 'PostGIS DB Schema' },
            { id: 'rag', label: 'RAG Architecture' },
            { id: 'mcp', label: 'MCP Protocol' },
            { id: 'api', label: 'FastAPI Spec' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00B4FF] to-[#38BDF8] text-[#031B2E] shadow-[0_0_20px_rgba(0,180,255,0.4)]'
                  : 'bg-[#06283D] text-[#A8C7D8] hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#5EE6FF]/30 space-y-8"
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-2xl text-white flex items-center gap-3">
                <Layers className="w-6 h-6 text-[#5EE6FF]" /> FloatChat Technical System Overview
              </h3>
              <p className="text-sm text-[#A8C7D8] leading-relaxed font-light">
                FloatChat is built upon a microservice architecture designed for real-time physical oceanographic exploration. Satellite-transmitted NetCDF files from the global ARGO assembly program are parsed and compressed into partitioned Parquet stores before indexing into PostgreSQL with PostGIS extension.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-5 rounded-2xl bg-[#06283D] border border-white/10 space-y-2">
                  <span className="font-mono text-xs text-[#5EE6FF]">01 Ingestion</span>
                  <h4 className="font-heading font-bold text-white text-sm">Parquet & PostGIS</h4>
                  <p className="text-xs text-[#A8C7D8]">High-throughput spatial indexing over 10M+ measurements.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#06283D] border border-white/10 space-y-2">
                  <span className="font-mono text-xs text-[#5EE6FF]">02 Intelligence</span>
                  <h4 className="font-heading font-bold text-white text-sm">ChromaDB + RAG</h4>
                  <p className="text-xs text-[#A8C7D8]">Hybrid vector search matching natural queries with float profiles.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#06283D] border border-white/10 space-y-2">
                  <span className="font-mono text-xs text-[#5EE6FF]">03 MCP Execution</span>
                  <h4 className="font-heading font-bold text-white text-sm">Model Context Protocol</h4>
                  <p className="text-xs text-[#A8C7D8]">Sandboxed tool calls enforcing SQL validation and bounds.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-2xl text-white flex items-center gap-3">
                  <Database className="w-6 h-6 text-[#5EE6FF]" /> PostgreSQL + PostGIS Schema Definition
                </h3>
                <button
                  onClick={() => handleCopy(`CREATE TABLE argo_floats (...);`)}
                  className="px-3 py-1.5 rounded-lg bg-[#06283D] border border-white/10 text-xs font-mono text-[#5EE6FF] flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy DDL'}
                </button>
              </div>

              <div className="bg-[#020d18] p-6 rounded-2xl border border-white/10 font-mono text-xs text-[#5EE6FF] overflow-x-auto">
                <pre>{`-- ARGO Platform Metadata Table
CREATE TABLE argo_floats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_number VARCHAR(32) UNIQUE NOT NULL,
    institution VARCHAR(128),
    status VARCHAR(16) DEFAULT 'Active',
    last_update TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ARGO Profiles Table with PostGIS Geometry
CREATE TABLE argo_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    float_id UUID REFERENCES argo_floats(id),
    juld TIMESTAMP WITH TIME ZONE NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL, -- WGS84 Lat/Lon
    region VARCHAR(64),
    cycle_number INT NOT NULL
);

-- Spatial Bounding Index
CREATE INDEX idx_argo_profiles_geom ON argo_profiles USING GIST (geom);
CREATE INDEX idx_argo_profiles_juld ON argo_profiles (juld DESC);`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'rag' && (
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-2xl text-white flex items-center gap-3">
                <Cpu className="w-6 h-6 text-[#5EE6FF]" /> Retrieval-Augmented Generation (RAG) Architecture
              </h3>
              <p className="text-sm text-[#A8C7D8] leading-relaxed font-light">
                FloatChat uses a two-stage hybrid retriever. The natural language input query is simultaneously processed through a dense vector search (`text-embedding-3-large` in ChromaDB) and a PostGIS spatial bounding box query.
              </p>
              <div className="p-6 rounded-2xl bg-[#06283D]/80 border border-white/10 font-mono text-xs text-white space-y-3">
                <div className="text-[#5EE6FF]">User Query: "Compare dissolved oxygen between Arabian Sea and Bay of Bengal"</div>
                <div className="text-[#A8C7D8]">↓ Vector Store Semantic Lookup (Top k=10)</div>
                <div className="text-[#A8C7D8]">↓ PostGIS Envelope Match ST_MakeEnvelope(60.0, 5.0, 95.0, 25.0)</div>
                <div className="text-[#22C55E]">→ Grounded Prompt Built with 24 Relevant Telemetry Chunks</div>
              </div>
            </div>
          )}

          {activeTab === 'mcp' && (
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-2xl text-white flex items-center gap-3">
                <Network className="w-6 h-6 text-[#5EE6FF]" /> Model Context Protocol (MCP) Tools
              </h3>
              <p className="text-sm text-[#A8C7D8] leading-relaxed font-light">
                The MCP layer enforces strict boundaries over generated code to prevent SQL injection or unoptimized dataset scans.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#06283D] border border-white/10 space-y-1">
                  <span className="text-[#5EE6FF] font-bold">mcp_argo_postgis_query</span>
                  <p className="text-[#A8C7D8]">Parameters: bbox, startDate, endDate, variables</p>
                </div>
                <div className="p-4 rounded-xl bg-[#06283D] border border-white/10 space-y-1">
                  <span className="text-[#5EE6FF] font-bold">mcp_compute_ts_diagram</span>
                  <p className="text-[#A8C7D8]">Parameters: floatIds, isopycnalOverlays</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-2xl text-white flex items-center gap-3">
                <FileCode className="w-6 h-6 text-[#5EE6FF]" /> FastAPI Backend Endpoint Contract
              </h3>
              <div className="bg-[#020d18] p-6 rounded-2xl border border-white/10 font-mono text-xs text-[#5EE6FF] overflow-x-auto">
                <pre>{`POST /api/v1/chat/query
Content-Type: application/json

{
  "query": "Show temperature profiles in Bay of Bengal",
  "user_context": {
    "preferred_units": "metric",
    "region_filter": "Bay of Bengal"
  }
}

Response 200 OK:
{
  "status": "success",
  "sql_generated": "SELECT ... FROM argo_profiles ...",
  "confidence": 0.96,
  "sources": ["INCOIS NetCDF v3.4"],
  "payload": {
    "map_points": [...],
    "chart_data": [...]
  }
}`}</pre>
              </div>
            </div>
          )}

        </motion.div>

      </div>
    </div>
  );
};
