# 🏛️ FloatChat AI — Technical Architecture & Data Pipeline Specification

## Overview

FloatChat AI is an autonomous, data-grounded scientific platform built to analyze massive ARGO float datasets. Rather than relying on static or hallucinated LLM text, FloatChat operates as a **hybrid dispatch and analytical execution engine**:

```
Natural Language Prompt
         │
         ▼
 Intent & Spatial Parser  ──► Metadata Catalog Pruning (juld / lat / lon)
         │                                   │
         ▼                                   ▼
 Analytics Engine (Pandas/PyArrow) ◄── Out-of-Core Parquet File Loading
         │
         ├────────────────────────────────┐
         ▼                                ▼
 Plotly Viz Spec Generator       Data-Driven LLM Synthesizer
         │                                │
         └────────────────┬───────────────┘
                          ▼
            Interactive Frontend Web App
```

---

## 1. Core Architectural Layers

### A. Frontend Presentation Layer (`remix_-floatchat---ai-ocean-data-explorer`)
- **Framework**: React 19 + Vite 6 + TypeScript.
- **Visualization**: `react-plotly.js` rendering hardware-accelerated SVG/Web Canvas charts (Depth Profiles, Distribution Histograms, T-S Diagrams, Multi-Year Overlays).
- **Styling**: Modern dark-ocean glassmorphic design system using Vanilla CSS, Framer Motion, and Lucide React icons.
- **State & Service Layer**: Asynchronous API client (`chat.service.ts`, `dashboard.service.ts`) connecting to FastAPI endpoints.

### B. REST API Gateway (`backend/app/api`)
- **Framework**: FastAPI (Python 3.10+).
- **Middleware Chain**:
  - `RequestIDMiddleware`: Generates and propagates correlation `X-Request-ID` across every log and payload.
  - `StructuredLoggingMiddleware`: JSON structured log emission via `loguru`.
  - `CORSMiddleware` & `SecurityHeadersMiddleware`: Production cross-origin and security headers.
  - `GZipMiddleware`: Response payload compression.

### C. Scientific Query Execution Engine (`backend/app/services/scientific`)
- **Query Planner (`query_planner_service.py`)**:
  - Regex-based intent classification (`TEMPERATURE`, `SALINITY`, `COMPARISON`, `FLOAT_LIST`, `TS_DIAGRAM`, `DEPTH_PROFILE`, `SPATIAL_MAP`, `GREETING`).
  - Spatial Bounding Box resolver mapping named regional entities (e.g. Bay of Bengal $\to [5^\circ\text{N}, 80^\circ\text{E}, 22^\circ\text{N}, 95^\circ\text{E}]$).
  - Out-of-range dataset bounds detector and temporal filter clamping.
- **Data Pipeline (`data_pipeline_service.py`)**:
  - Evaluates bounding box overlap against `argo_metadata_catalog.csv` (`juld_min_est`, `juld_max_est`, `lat_min_est`, `lat_max_est`, etc.).
  - Selectively reads relevant monthly `.parquet` files via PyArrow columnar readers.
  - Filters rows by latitude, longitude, depth (`DEPTH_M`), and temporal bounds.
- **Analytics Engine (`analytics_engine.py`)**:
  - Computes physical oceanography statistics: mean, standard deviation, min, max, depth coverage, centroid coordinates.
  - Thermocline gradient detection: computes $\frac{dT}{dz}$ to locate maximum thermal stratification layer.
  - Salinity regime classification: categorizes water masses into High Salinity (evaporation-dominated) vs Low Salinity (riverine runoff).
  - Multi-year comparison: calculates inter-annual deltas ($\Delta T, \Delta S$) and classifies warming vs cooling trends.
- **Visualization Engine (`visualization_engine.py`)**:
  - Builds complete, dynamic Plotly configuration dictionaries (`data` + `layout`) matching notebook reference styling.
- **Data-Driven LLM Synthesizer (`mock_provider.py`)**:
  - Generates clear, structured Markdown responses with bullet points, citations, and an easy-to-read **Plain-Language Summary** summarizing key findings.

---

## 2. Environment Variables & Key Reference

FloatChat supports the following environment variables across backend and frontend environments:

```ini
# --- LLM API Keys (Optional: FloatChat uses data-driven fallback if omitted) ---
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-api03-...
GEMINI_API_KEY=AIzaSy...

# --- Database & Cache Configurations (Optional) ---
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/floatchat
REDIS_URL=redis://localhost:6379/0
VECTOR_DB_URL=http://localhost:8000/chroma
VECTOR_DB_COLLECTION=argo_embeddings

# --- Data File Paths ---
PARQUET_DATA_DIR=./SIH2025/Data/argo_prototype_parquet
METADATA_CSV_PATH=./SIH2025/Data/argo_metadata_catalog.csv

# --- Server Ports & URLs ---
PORT=8000
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
LOG_LEVEL=INFO
ENVIRONMENT=development
```

---

## 3. Data Flow Example: Regional Query Execution

When a user submits `"Show temperature near Bay of Bengal"`:

1. **Frontend**: Sends `POST /api/v1/chat` with body `{"message": "Show temperature near Bay of Bengal"}`.
2. **Query Planner**: Identifies intent `TEMPERATURE`, resolves region `Bay of Bengal` to bounding box $[5^\circ\text{N}, 80^\circ\text{E}, 22^\circ\text{N}, 95^\circ\text{E}]$.
3. **Data Pipeline**: Prunes 36 monthly Parquet files down to overlapping catalog files, loads column subset (`LATITUDE`, `LONGITUDE`, `DEPTH_M`, `TEMP`, `PSAL`), filters by bounding box.
4. **Analytics Engine**: Computes $N=2,000$ observations, mean temp $= 12.60^\circ\text{C}$, range $= [2.66^\circ\text{C}, 28.04^\circ\text{C}]$, thermocline boundary $= 85\text{m} - 165\text{m}$.
5. **Visualization Engine**: Produces 2 Plotly chart specifications (Inverted Depth Profile curve + Temperature Distribution Histogram).
6. **LLM Synthesizer**: Formats response with structured findings, GDAC data citations, and a **Plain-Language Summary**.
7. **Frontend**: Renders responsive Plotly charts, live stat cards, PostGIS query preview, and formatted Markdown text.
