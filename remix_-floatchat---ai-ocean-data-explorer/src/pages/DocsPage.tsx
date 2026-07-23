import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Layers, GitBranch, Cpu, Code2, Box, Globe, ExternalLink } from 'lucide-react';
import { DocumentationLayout } from '../layouts/DocumentationLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const DocsPage: React.FC = () => {
  const sections = [
    {
      id: 'arch',
      title: 'Architecture Overview',
      desc: 'Learn about FloatChat’s decoupled frontend-backend architecture, PostGIS schema design, and netCDF parsing pipeline.',
      badge: 'Core Guide',
      icon: Layers,
    },
    {
      id: 'workflow',
      title: 'Query Workflow',
      desc: 'Understand how natural language prompts are translated into validated SQL queries via LangChain orchestrators.',
      badge: 'Pipeline',
      icon: GitBranch,
    },
    {
      id: 'tech',
      title: 'Tech Stack Specifications',
      desc: 'Detailed breakdown of React 19, Vite, Tailwind CSS, FastAPI, PostgreSQL, FAISS, and Docker dependencies.',
      badge: 'Specs',
      icon: Cpu,
    },
    {
      id: 'api',
      title: 'REST & WebSocket API',
      desc: 'FastAPI REST endpoints for programmatic access to subsetted ARGO float telemetry and depth profiles.',
      badge: 'Coming in Phase 2',
      isComingSoon: true,
      icon: Code2,
    },
    {
      id: 'deploy',
      title: 'Deployment & Scale',
      desc: 'Containerized deployment guides with Docker, Kubernetes manifests, and edge CDN cache configuration.',
      badge: 'Coming in Phase 2',
      isComingSoon: true,
      icon: Box,
    },
    {
      id: 'research',
      title: 'ARGO & Ocean References',
      desc: 'Citations, open data license details, netCDF variable dictionaries, and international oceanographic benchmarks.',
      badge: 'Open Science',
      icon: Globe,
    },
  ];

  return (
    <DocumentationLayout title="Documentation & Research Portal">
      <Container size="lg" className="flex flex-col gap-12">
        <div className="text-center flex flex-col items-center gap-4">
          <Badge variant="accent" glowing icon={<BookOpen className="w-3.5 h-3.5" />}>
            Documentation Portal
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-white">
            FloatChat <span className="gradient-ocean-text">Technical Documentation</span>
          </h1>
          <p className="max-w-xl text-base text-[#A8C7D8]">
            Explore system architecture, API schemas, netCDF translation pipelines, and open ocean data guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Card
                key={sec.id}
                variant="glass"
                className={`p-6 flex flex-col justify-between hover:border-[#00B4FF] transition-all group ${
                  sec.isComingSoon ? 'opacity-80' : ''
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#00B4FF]/15 border border-[#00B4FF]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-[#5EE6FF]" />
                    </div>
                    {sec.isComingSoon ? (
                      <Badge variant="phase2" size="sm">{sec.badge}</Badge>
                    ) : (
                      <Badge variant="accent" size="sm">{sec.badge}</Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-heading text-white group-hover:text-[#5EE6FF] transition-colors">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-[#A8C7D8] leading-relaxed mt-2">{sec.desc}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#5EE6FF]/10 flex items-center justify-between text-xs text-[#00B4FF] font-mono">
                  <span>{sec.isComingSoon ? 'Phase 2 Endpoint' : 'Read Docs →'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </DocumentationLayout>
  );
};
