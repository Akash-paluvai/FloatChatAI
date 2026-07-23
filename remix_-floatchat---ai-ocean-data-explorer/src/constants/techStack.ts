export interface TechItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'AI & ML' | 'DevOps';
  description: string;
  isPhase2Plus: boolean;
  iconName: string;
}

export const TECH_STACK: TechItem[] = [
  { name: 'React 19', category: 'Frontend', description: 'Modern UI library with Server Components & Concurrent Mode', isPhase2Plus: false, iconName: 'Atom' },
  { name: 'TypeScript', category: 'Frontend', description: 'Strict static typing for scalable component architecture', isPhase2Plus: false, iconName: 'Code2' },
  { name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first CSS engine for glassmorphic dark design', isPhase2Plus: false, iconName: 'Palette' },
  { name: 'Framer Motion', category: 'Frontend', description: 'Fluid spring physics & declarative page animation engine', isPhase2Plus: false, iconName: 'Sparkles' },
  { name: 'Python 3.12', category: 'Backend', description: 'High-performance scientific processing & netCDF parsing', isPhase2Plus: true, iconName: 'FileCode' },
  { name: 'FastAPI', category: 'Backend', description: 'Asynchronous Python REST API framework for query execution', isPhase2Plus: true, iconName: 'Zap' },
  { name: 'PostgreSQL', category: 'Database', description: 'Relational database with PostGIS spatial ocean extensions', isPhase2Plus: true, iconName: 'Database' },
  { name: 'Plotly', category: 'Frontend', description: 'Interactive 3D oceanographic profile graphing library', isPhase2Plus: true, iconName: 'BarChart' },
  { name: 'Docker', category: 'DevOps', description: 'Containerized deployment pipeline for microservice scalability', isPhase2Plus: true, iconName: 'Box' },
  { name: 'LangChain', category: 'AI & ML', description: 'LLM orchestration framework for Text-to-SQL ocean retrieval', isPhase2Plus: true, iconName: 'BrainCircuit' },
  { name: 'FAISS / ChromaDB', category: 'Database', description: 'Vector embeddings store for oceanographic metadata RAG', isPhase2Plus: true, iconName: 'Search' },
  { name: 'OpenAI / Gemini', category: 'AI & ML', description: 'Advanced LLM engines powering natural language ocean synthesis', isPhase2Plus: true, iconName: 'Cpu' },
];
