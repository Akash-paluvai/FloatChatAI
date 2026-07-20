# FloatChat — Progress & Technical Understanding Document

**Project Name:** FloatChat — AI-Powered Conversational Oceanographic Data Platform  
**Target Domain:** Deep-Ocean Data Discovery & ARGO Profiling Analytics  
**Design Aesthetic:** Premium AI Startup (inspired by OpenAI, Apple, Perplexity, Linear, Vercel, Stripe)  
**Theme:** "Talk to the Ocean."  
**Status:** Completed & Production-Ready  

---

## 1. Executive Summary & Vision

FloatChat is a next-generation AI-powered oceanographic research platform that democratizes access to global **ARGO Float Data** (temperature, salinity, pressure, depth profiles, oxygen levels, trajectories) through natural language queries. 

Unlike traditional geospatial dashboards or static scientific tools, FloatChat provides a sleek, futuristic, conversational interface backed by:
- **Retrieval-Augmented Generation (RAG)** over structured oceanographic metadata and vector embeddings.
- **Model Context Protocol (MCP)** for secure tool execution and data fetching.
- **Dynamic Database Translators** (Natural Language -> PostGIS / SQL / Parquet query synthesis).
- **Client-side Scientific Data Visualization** (Interactive Leaflet/Canvas maps, T-S diagrams, Depth Profiles, Time-Series charts).

---

## 2. Workspace File Analysis & Findings

After auditing all existing notebooks, datasets, and prototype code in the repository (`/Users/akashpaluvai/college/floatchat`):

### 2.1 Jupyter Notebooks & Research Artifacts
1. **`03_query_examples (1).ipynb` & `Copy of 03_query_examples.ipynb`**:
   - Focus: Python-based analysis of ARGO float profile data using pandas and matplotlib.
   - Computes spatial temperature trends grouped by date (`JULD`), depth profiles, and multi-float scatter comparisons.
2. **`Step2.ipynb` & `step22 (1).ipynb`**:
   - Focus: Vector DB initialization (`ChromaDB` / `SentenceTransformers`) for semantic indexing of float metadata and location summaries.
   - Implements `hybrid_retrieve(query, top_k, year, region, depth_range)` combining dense embeddings with metadata filters.
3. **`Step3 (2).ipynb` & `s222 (1).ipynb`**:
   - Focus: Natural language Query Planner -> Parquet retrieval engine.
   - Handles structured parameters (Region: Bay of Bengal, Arabian Sea, Indian Ocean; Year: 2022–2024; Depths: 0–2000m).
4. **`s3rag (1).ipynb` & `SIH2025/s3rag.ipynb`**:
   - Focus: End-to-end conversational loop integrating RAG retrieval with LLM response generation and interactive Plotly visualization generation.

### 2.2 Datasets
- **`argo_filtered_2022-005.csv`**, **`argo_filtered_2023-004.csv`**, **`argo_filtered_2024-003.csv`**, **`argo_filtered_data-002.csv`**:
   - Multi-gigabyte filtered ARGO float dataset covering the Indian Ocean, Bay of Bengal, and Arabian Sea regions.
   - Core fields: `LATITUDE`, `LONGITUDE`, `JULD` (Julian Date/Timestamp), `PRES` (Pressure in dbar / approx depth in meters), `TEMP` (Temperature °C), `PSAL` (Practical Salinity PSU), `FLOAT_ID` / `PLATFORM_NUMBER`.

### 2.3 Web Platform Architecture
- Modern React + TypeScript + Tailwind CSS + Framer Motion application built with clean folder structure (`src/components/`, `src/pages/`, `src/hooks/`, `src/utils/`, `src/types/`, `src/router/`).
- Includes Glassmorphism styling, Space Grotesk & Inter typography, dark ocean color palette (`#031B2E`, `#06283D`, `#00B4FF`, `#5EE6FF`, `#38BDF8`), interactive canvas waves, Leaflet maps, and Recharts depth profile visualizers.

---

## 3. Core Technical Architecture & Data Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌────────────────┐
│ NetCDF Files │ ──> │ Parquet Data │ ──> │ PostgreSQL   │ ──> │ Vector DB      │
│ (ARGO raw)   │     │ (Compressed) │     │ (PostGIS)    │     │ (Chroma/FAISS) │
└──────────────┘     └──────────────┘     └──────────────┘     └────────────────┘
                                                                        │
┌──────────────┐     ┌──────────────┐     ┌──────────────┐              ▼
│ Interactive  │ <── │ Viz Engine   │ <── │ LLM + MCP    │ <── ┌────────────────┐
│ UI Dashboard │     │ (Plot/Map)   │     │ (Query Plan) │     │ Retriever RAG  │
└──────────────┘     └──────────────┘     └──────────────┘     └────────────────┘
```

1. **Ingestion Layer**: NetCDF telemetry data converted to partitioned Parquet files for ultra-fast columnar reads.
2. **Database Layer**: PostgreSQL + PostGIS storing spatial points (`LATITUDE`, `LONGITUDE`), float metadata, and profile indices.
3. **Retrieval (RAG + MCP)**: ChromaDB index containing float trajectory summaries and regional metadata. LLM emits structured MCP function calls (e.g. `query_argo_dataset(region, variables, date_range)`).
4. **Presentation Layer**: React frontend powered by Framer Motion, Tailwind CSS, Space Grotesk + Inter typography, glassmorphic card overlays, interactive map overlays, and scientific visualization tools.

---

## 4. UI/UX Design System Specification

### Color Palette (Dark Mode Only)
- **Primary Background**: `#031B2E` (Deep Ocean Abyss)
- **Secondary Background**: `#06283D` (Midnight Oceanic)
- **Surface**: `rgba(255, 255, 255, 0.05)` (Frosted Glass Glassmorphism)
- **Ocean Blue**: `#00B4FF` (Glowing Cyan Blue)
- **Cyan Accent**: `#5EE6FF` (Bio-luminescent Cyan)
- **Sky Accent**: `#38BDF8` (Atmospheric Sky)
- **Text Primary**: `#FFFFFF` (Pure White)
- **Text Muted**: `#A8C7D8` (Pacific Ocean Silver-Blue)
- **Success Accent**: `#22C55E` (Emerald Marine)

### Typography
- **Headings**: `Space Grotesk`, sans-serif (Futuristic, scientific, crisp)
- **Body & Code**: `Inter`, sans-serif / `JetBrains Mono`, monospace

---

## 5. Website Application Structure & Route Map

| Route | Component / Page | Description |
|---|---|---|
| `/` | `LandingPage.tsx` | Hero, Tech Carousel, 6 Glass Features, 10-Step Pipeline, Live Demo Preview, Viz Showcase, Animated Stats, Research Impact, CTA, Footer. |
| `/demo` | `DemoPage.tsx` | ChatGPT-style scientific interface with live streaming responses, query generator (SQL/Python), interactive Leaflet map integration, chart tabs, confidence metrics, and export tools. |
| `/dashboard` | `DashboardPage.tsx` | Full-screen Ocean Analytics Dashboard with filter sidebar (Depth, Salinity, Temp, Date, Bounding Box), interactive float map, depth profile plotters, and float trajectory viewer. |
| `/docs` | `DocsPage.tsx` | Interactive Architecture documentation, system overview, database schema, RAG & MCP workflow diagrams, API references, and future roadmap. |
| `/about` | `AboutPage.tsx` | Mission statement, scientific foundation (ARGO program, INCOIS / NOAA alignment), team, technology stack, and ocean research impact. |

---

## 6. Detailed Implementation & Checklist

- [x] Audit all workspace notebooks, datasets, and prototype structure.
- [x] Create `progress.md` capturing codebase understanding and architectural blueprint.
- [x] Initialize / Update project dependencies (Tailwind, Lucide Icons, Framer Motion, React Router, Recharts/Chart libraries, Leaflet map support).
- [x] Implement Design Tokens, Fonts, and Global CSS (Glassmorphism utilities, ocean gradients, glowing effects).
- [x] Build Reusable Navigation Bar & Footer with dynamic scroll blur and path highlighting.
- [x] Implement Landing Page (`/`):
  - [x] Section 1: Glass Navbar with scroll blur
  - [x] Section 2: Ocean Hero with animated canvas background & glowing neural illustration
  - [x] Section 3: Trusted Tech Carousel (Python, FastAPI, PostGIS, FAISS, etc.)
  - [x] Section 4: 6 Premium Glass Feature Cards with hover glow
  - [x] Section 5: Interactive 10-step NetCDF -> Dashboard Data Pipeline
  - [x] Section 6: Interactive Demo Preview (ChatGPT-style interface)
  - [x] Section 7: Scientific Visualization Showcase Cards
  - [x] Section 8: Animated Counter Statistics (10M+ Measurements, 100K+ Profiles, <3s response)
  - [x] Section 9: Research Impact Showcase (6 societal impact domains)
  - [x] Section 10: High-converting Call to Action
- [x] Implement AI Chat Demo Page (`/demo`):
  - [x] Conversation sidebar with suggested queries & history
  - [x] Interactive query prompt bar with example triggers
  - [x] Multi-turn simulated LLM response stream with SQL code view, interactive map point viewer, charts (depth profiles), confidence score badge, and scientific citations
- [x] Implement Ocean Analytics Dashboard (`/dashboard`):
  - [x] Geospatial ocean map with markers & trajectories
  - [x] Real-time parameter controls (Temperature, Salinity, Depth slider, Region selector)
  - [x] Multi-chart layout (Vertical depth profile curve, surface temperature stats)
- [x] Implement Documentation Page (`/docs`):
  - [x] Interactive tab navigation for System Overview, PostGIS Schema, RAG Architecture, MCP Tools, and FastAPI Endpoint Spec
- [x] Implement About Page (`/about`):
  - [x] Vision, mission, team, and 4-phase strategic roadmap
- [x] Verify full responsive UI, dark mode styling, and clean production build with Vite (`npx vite build` succeeded with 0 errors).
