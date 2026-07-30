import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Layers, GitBranch, Cpu, Code2, Box, Globe, Search, Copy, Check,
  ChevronRight, Terminal, Database, FileSpreadsheet, ArrowRight, ExternalLink, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocumentationLayout } from '../layouts/DocumentationLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface DocTopic {
  id: string;
  category: 'architecture' | 'queries' | 'api' | 'data';
  title: string;
  badge: string;
  description: string;
  details: string;
  codeSnippet?: string;
  codeLanguage?: string;
  params?: Array<{ name: string; type: string; desc: string }>;
  exampleQuery?: string;
}

export const DocsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTopic, setActiveTopic] = useState<DocTopic | null>(null);
  const [copied, setCopied] = useState(false);

  const topics: DocTopic[] = [
    {
      id: 'arch-overview',
      category: 'architecture',
      title: 'Decoupled Multi-Agent & Execution Engine Architecture',
      badge: 'Core Guide',
      description: 'FloatChat translates natural language prompts into spatial/temporal execution plans, selectively loading columnar Parquet files with zero hardcoded defaults.',
      details: `FloatChat AI is structured as a decoupled 5-tier architecture:

1. **Frontend Presentation**: React 19 + Vite web application with interactive Plotly.js charts, dark-ocean styling, and live telemetry cards.
2. **FastAPI REST Gateway**: Asynchronous Python API gateway with correlation request IDs, structured logging, CORS, and standard API envelope responses.
3. **Query Planner Service**: Intent detection parser that converts natural language queries into structured bounding boxes (e.g. Bay of Bengal -> [5, 80, 22, 95]), depth filters, and temporal ranges.
4. **PyArrow Data Pipeline**: Selective columnar dataset reader that prunes 36 monthly Parquet files based on catalog metadata overlap, loading only required columns (TEMP, PSAL, DEPTH_M).
5. **Analytics & Visualization Engines**: Computes thermocline gradients (dT/dz), salinity regimes, inter-annual deltas, and multi-chart Plotly specifications accompanied by plain-language summaries.`,
      codeLanguage: 'bash',
      codeSnippet: `# Test backend execution engine health
curl -s http://127.0.0.1:8000/api/v1/health | python3 -m json.tool`,
    },
    {
      id: 'query-syntax',
      category: 'queries',
      title: 'Natural Language Query Syntax & Intent Patterns',
      badge: 'Query Guide',
      description: 'Supported query patterns including depth profiles, salinity regimes, inter-annual comparisons, T-S diagrams, and spatial maps.',
      details: `FloatChat supports 6 distinct scientific oceanographic query intents:

1. **Temperature Depth Profiles**: "Show temperature near Bay of Bengal at 500m"
   - Generates inverted depth profile curve (0m to 2000m) + temperature distribution histogram.
2. **Salinity & Water Mass Regimes**: "Analyze salinity in Arabian Sea in 2023"
   - Computes mean salinity, identifies High Salinity Water (ASHSW) vs Riverine Runoff layers.
3. **Inter-Annual Comparisons**: "Compare 2022 vs 2024 temperatures"
   - Evaluates multi-year deltas (dT) and trend direction (Warming / Cooling).
4. **T-S Diagrams**: "Generate T-S diagram for Bay of Bengal"
   - Produces Temperature vs. Salinity scatter plots to trace water mass signatures.
5. **Spatial Bounding Box Search**: "Map temperature across Indian Ocean"
   - Filters observation coordinates and calculates spatial centroids.
6. **General Greetings**: "Hello / Help"
   - Interactive system intro explaining capabilities.`,
      exampleQuery: 'Show temperature near Bay of Bengal',
    },
    {
      id: 'api-chat-endpoint',
      category: 'api',
      title: 'POST /api/v1/chat — Primary Conversational & Analytics API',
      badge: 'REST API',
      description: 'Main endpoint for natural language query execution over 54M Parquet observations. Returns Plotly specs, analytics grid metrics, and plain-language summary text.',
      details: `Endpoint: POST /api/v1/chat
Content-Type: application/json

Request Payload:
{
  "message": "Show temperature near Bay of Bengal"
}

Response Properties:
- markdown_response: Formatted markdown string containing Key Findings, Citations, and a Plain-Language Summary.
- viz_spec: Array of Plotly chart configuration objects (depth profile, histogram, etc.).
- analytics_summary: Real-data statistics (total observations, mean temp, thermocline zone, centroid coordinates).
- sql_query: Generated PostGIS / SQL spatial query string for auditability.
- suggested_followups: Contextual follow-up query suggestions.`,
      codeLanguage: 'json',
      codeSnippet: `// Example Response
{
  "success": true,
  "data": {
    "response_text": "## Bay Of Bengal — Temperature Analysis...",
    "viz_spec": [
      {
        "chart_type": "depth_profile",
        "title": "Depth Profile: TEMP",
        "data": [{ "x": [28.0, 12.6, 2.6], "y": [0.4, 500, 2020], "type": "scatter" }]
      }
    ],
    "analytics_summary": {
      "total_observations": 2000,
      "avg_temp": "12.60°C",
      "thermocline": "85m – 165m"
    }
  }
}`,
      params: [
        { name: 'message', type: 'string', desc: 'Natural language query prompt' },
        { name: 'session_id', type: 'string (optional)', desc: 'Session identifier for context' },
      ],
    },
    {
      id: 'api-dashboard-endpoint',
      category: 'api',
      title: 'GET /api/v1/dashboard/summary & /region-stats',
      badge: 'REST API',
      description: 'Analytics APIs returning catalog-wide dataset counts, spatial bounds, dataset size distribution, and region-specific statistics.',
      details: `FloatChat provides two dedicated dashboard endpoints:

1. GET /api/v1/dashboard/summary
   - Returns metadata summary for all 36 monthly Parquet files (~54M observations).
   - Includes lat/lon bounds, time ranges, and sample statistics.

2. GET /api/v1/dashboard/region-stats/{region_name}
   - Computes live stats for named ocean regions (Bay of Bengal, Arabian Sea, Southern Ocean, etc.).
   - Returns real observation counts, temperature range, thermocline depth, and centroid coordinates.`,
      codeLanguage: 'bash',
      codeSnippet: `# Fetch live stats for Arabian Sea
curl -s "http://127.0.0.1:8000/api/v1/dashboard/region-stats/Arabian%20Sea"`,
    },
    {
      id: 'argo-data-dictionary',
      category: 'data',
      title: 'ARGO NetCDF & Parquet Data Variable Dictionary',
      badge: 'Data Spec',
      description: 'Scientific definitions, measurement units, and quality control rules for oceanographic variables in FloatChat.',
      details: `FloatChat reads columnar Parquet files derived from ARGO GDAC NetCDF archives:

1. **TEMP (Temperature)**: Sea water temperature in degrees Celsius (°C). Range: -2.0°C to +35.0°C.
2. **PSAL (Salinity)**: Practical Salinity Units (PSU). Range: 0.0 to 42.0 PSU.
3. **DEPTH_M / PRES (Depth / Pressure)**: Depth below sea surface in meters (m) or decibars (dbar). Range: 0m to 6000m.
4. **LATITUDE & LONGITUDE**: Geographical position coordinates in WGS84 decimal degrees (-90° to +90° Lat, -180° to +180° Lon).
5. **JULD (Julian Day)**: Date and time of profile measurement stored in ISO-8601 UTC format.
6. **source_file**: Reference filename from ARGO Global Data Assembly Center (GDAC).`,
      codeLanguage: 'python',
      codeSnippet: `# PyArrow schema inspection snippet
import pyarrow.parquet as pq
table = pq.read_table("2022_01_MINIMAL.parquet")
print(table.schema)`,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Documentation' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'queries', label: 'Query Syntax' },
    { id: 'api', label: 'REST API' },
    { id: 'data', label: 'Data Dictionary' },
  ];

  const filteredTopics = topics.filter((topic) => {
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DocumentationLayout title="Documentation & API Reference">
      <div className="py-6">
        <Container size="xl" className="flex flex-col gap-8">
          {/* Header */}
          <div className="text-center flex flex-col items-center gap-3 max-w-2xl mx-auto">
            <Badge variant="accent" glowing icon={<BookOpen className="w-3.5 h-3.5" />}>
              Developer & Scientific Documentation
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">
              FloatChat <span className="gradient-ocean-text">Platform Reference</span>
            </h1>
            <p className="text-sm text-[#A8C7D8]">
              Explore system architecture, REST API schemas, natural language query syntax, and ARGO oceanographic data specifications.
            </p>

            {/* Interactive Search Bar */}
            <div className="relative w-full max-w-lg mt-2">
              <Search className="w-4 h-4 text-[#5EE6FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, API endpoints, query syntax..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06283D]/90 border border-[#5EE6FF]/20 text-xs text-white placeholder-[#A8C7D8]/60 focus:outline-none focus:border-[#00B4FF] transition-all"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#00B4FF] text-[#031B2E] font-bold shadow-md shadow-[#00B4FF]/20'
                    : 'bg-[#06283D]/60 text-[#A8C7D8] border border-[#5EE6FF]/15 hover:text-white hover:border-[#00B4FF]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTopics.map((topic) => (
              <Card
                key={topic.id}
                variant="solid"
                className="p-5 bg-[#06283D]/80 border-[#5EE6FF]/15 hover:border-[#00B4FF]/40 flex flex-col justify-between cursor-pointer transition-all group"
                onClick={() => setActiveTopic(topic)}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="accent" size="sm">{topic.badge}</Badge>
                    <ChevronRight className="w-4 h-4 text-[#A8C7D8] group-hover:text-[#00B4FF] group-hover:translate-x-1 transition-all" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#5EE6FF] transition-colors leading-snug">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-[#A8C7D8] mt-2 leading-relaxed line-clamp-3">
                      {topic.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#5EE6FF]/10 flex items-center justify-between text-xs text-[#00B4FF] font-mono">
                  <span>View Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            ))}
          </div>

          {/* Topic Detail Modal / Drawer */}
          <AnimatePresence>
            {activeTopic && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#031B2E]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
                onClick={() => setActiveTopic(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#06283D] border border-[#5EE6FF]/30 p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative"
                >
                  {/* Close button */}
                  <button
                    onClick={() => setActiveTopic(null)}
                    className="absolute right-6 top-6 p-2 rounded-xl bg-[#031B2E] text-[#A8C7D8] hover:text-white border border-[#5EE6FF]/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3">
                    <Badge variant="accent">{activeTopic.badge}</Badge>
                    <span className="text-xs text-[#A8C7D8] font-mono uppercase">{activeTopic.category}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">{activeTopic.title}</h2>

                  {/* Body Details */}
                  <div className="text-xs text-[#A8C7D8] leading-relaxed space-y-3 font-sans whitespace-pre-line bg-[#031B2E]/60 p-4 rounded-2xl border border-[#5EE6FF]/10">
                    {activeTopic.details}
                  </div>

                  {/* Code snippet if present */}
                  {activeTopic.codeSnippet && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#A8C7D8]">
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-[#00B4FF]" />
                          Example Snippet ({activeTopic.codeLanguage || 'code'})
                        </span>
                        <button
                          onClick={() => handleCopyCode(activeTopic.codeSnippet!)}
                          className="flex items-center gap-1 text-[#5EE6FF] hover:underline"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                      </div>
                      <pre className="p-4 rounded-xl bg-[#031B2E] border border-[#5EE6FF]/20 text-xs font-mono text-[#5EE6FF] overflow-x-auto">
                        <code>{activeTopic.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Executable query button */}
                  {activeTopic.exampleQuery && (
                    <div className="pt-2 flex justify-end">
                      <Button
                        variant="gradient"
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        onClick={() => {
                          setActiveTopic(null);
                          navigate('/demo');
                        }}
                      >
                        Try Query in Demo Explorer
                      </Button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </div>
    </DocumentationLayout>
  );
};
