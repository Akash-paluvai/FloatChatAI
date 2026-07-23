# FloatChat — Talk to the Ocean 🌊

FloatChat is an AI-powered oceanographic platform enabling users to explore ARGO ocean data through natural language conversations.

> **Phase 1 Complete**: Production-grade React 19 + TypeScript + Tailwind CSS + Framer Motion frontend architecture. Ready for Phase 2 backend (FastAPI, PostgreSQL, PostGIS, RAG, MCP) integration.

---

## 🎨 Tech Stack & Architecture

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (Dark Mode Only, Custom Glassmorphism, Deep Ocean Palette)
- **Animations**: Framer Motion (Spring Physics, Particle Wave Canvas, Floating Cards)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React Icons

---

## 📁 Project Structure

```
src/
├── assets/             # Brand logos & static vectors
├── config/             # App metadata & environment configuration
├── constants/          # Theme tokens, routes, navigation & tech stack
├── types/              # Domain TypeScript interfaces (ocean, chat, dashboard, service)
├── mock/               # Isolated mock datasets for Phase 1
├── services/           # Async service abstraction layer (ready for FastAPI)
├── hooks/              # Custom React hooks
├── components/
│   ├── ui/             # Primitive Design System elements (Button, Card, Badge, Dialog, etc.)
│   ├── common/         # Global shared components (Navbar, Footer, SEOHead, ErrorBoundary)
│   └── sections/       # Landing page sections (Hero, Features, Timeline, Architecture, Roadmap)
├── interactive/        # Visual effects & canvas animations
├── layouts/            # Global page layout wrappers (MainLayout, DashboardLayout, DocumentationLayout)
├── pages/              # Route views (LandingPage, DemoPage, DashboardPage, DocsPage, AboutPage, StatusPage, NotFoundPage)
├── router/             # React Router DOM configuration
└── styles/             # Tailwind CSS & global glassmorphism CSS
```

---

## 🌐 Routes

- `/` — Landing Page (Hero, Features, How It Works, Tech Stack, Architecture, Roadmap, CTA)
- `/demo` — Interactive Mock AI Chat Interface (Sample prompt, depth profiles, buoy coordinates, SQL card)
- `/dashboard` — Realistic Ocean Analytics Dashboard (Leaflet map, stat metrics, dataset browser, recent queries log)
- `/docs` — Technical Documentation Portal (Architecture, Workflow, Tech Stack, API, Deployment, Research)
- `/about` — Mission, Vision & Future Scope
- `/status` — System Status & Engineering Roadmap Matrix
- `/404` — Ocean Coordinates Not Found

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
