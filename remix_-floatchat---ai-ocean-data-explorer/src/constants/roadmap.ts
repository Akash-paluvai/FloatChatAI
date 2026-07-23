export interface RoadmapPhase {
  phase: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  description: string;
  deliverables: string[];
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: 1,
    title: 'Frontend Foundation',
    subtitle: 'UI/UX Design System & Layout Architecture',
    status: 'completed',
    description: 'Design system, React 19 routing, glassmorphism UI, interactive mock chat, realistic dashboard layout, and services layer abstraction.',
    deliverables: ['Design System Primitives', 'Framer Motion Animations', 'Mock AI Chat Interface', 'Analytics Dashboard UI', 'Services Abstraction Layer'],
  },
  {
    phase: 2,
    title: 'Backend & API Integration',
    subtitle: 'FastAPI REST Endpoints & Data Ingestion',
    status: 'upcoming',
    description: 'Deploy Python FastAPI microservices, netCDF parser pipeline, and asynchronous endpoints connecting directly to the React frontend.',
    deliverables: ['FastAPI Server Setup', 'netCDF ARGO Ingestion', 'Query Translation API', 'WebSocket Live Data Feeds'],
  },
  {
    phase: 3,
    title: 'Database & Spatial Indexing',
    subtitle: 'PostgreSQL + PostGIS & Vector Database',
    status: 'upcoming',
    description: 'Index millions of ARGO temperature/salinity profiles with spatial PostGIS querying and FAISS vector embeddings.',
    deliverables: ['PostgreSQL Schema Design', 'PostGIS Spatial Indexing', 'ChromaDB Vector Store', 'Optimized Parquet Caching'],
  },
  {
    phase: 4,
    title: 'AI Layer & RAG Engine',
    subtitle: 'LangChain Orchestration & Text-to-SQL',
    status: 'upcoming',
    description: 'Integrate LLMs with custom prompt templates, query validation, self-correcting SQL generation, and MCP server bindings.',
    deliverables: ['LangChain Pipeline', 'Text-to-SQL Agent', 'Contextual RAG Retrieval', 'MCP Tool Extensions'],
  },
  {
    phase: 5,
    title: 'Advanced Visualizations',
    subtitle: 'Plotly 3D Profiles & Leaflet Maps',
    status: 'upcoming',
    description: 'Render interactive 3D ocean depth heatmaps, salinity profiles, and real-time ARGO buoy tracking trajectories.',
    deliverables: ['Plotly 3D Depth Graphs', 'Leaflet Heatmap Overlays', 'Spatial Bounding Box Filter', 'Export PDF/CSV Reports'],
  },
  {
    phase: 6,
    title: 'Deployment & Scale',
    subtitle: 'Global Cloud Infrastructure & Edge CDN',
    status: 'upcoming',
    description: 'Containerized deployment on Kubernetes/Docker with global CDN caching, API rate limiting, and 99.9% uptime SLA.',
    deliverables: ['Docker Containerization', 'CI/CD Automated Testing', 'Production Monitoring', 'Global Edge CDN Deployment'],
  },
];
