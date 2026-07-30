# 🌊 FloatChat AI — Autonomous ARGO Ocean Data Explorer

FloatChat AI is an enterprise-grade, multi-agent oceanographic platform for analyzing real **ARGO float observations** using natural language queries. It translates natural-language prompts into structured spatial/temporal data plans, executes out-of-core operations over **54+ Million real-world ocean observations** (36 monthly Parquet datasets), computes physical oceanography statistics, and generates multi-chart **interactive Plotly visual specifications** accompanied by plain-language scientific summaries.

---

## 🏛️ System Architecture

```
User Query ("Show temperature near Bay of Bengal")
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│               Frontend (React 19 + Vite)                │
│  - Plotly.js Multi-Chart Renderer                       │
│  - Interactive Real-Time Analytics Cards                │
│  - Rich Markdown + Scientific Citations                 │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP POST /api/v1/chat
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 FastAPI REST API Gateway                 │
│  - Correlation Request ID & Structured Logging           │
│  - CORS / Security Headers / Exception Handlers          │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│               Query Planner Service                     │
│  - Regex & Scientific Intent Detection                  │
│  - Bounding Box BBox Resolver (Bay of Bengal, etc.)     │
│  - Temporal & Depth Filter Extractor                    │
└───────────────────────────┬─────────────────────────────┘
                            │ Structured Execution Plan
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Data Pipeline Service (PyArrow)            │
│  - Metadata Catalog File Pruning (juld / lat / lon)     │
│  - Columnar Parquet Load (TEMP, PSAL, DEPTH_M)           │
│  - Zero Hardcoded / Zero Template Data Filtering        │
└───────────────────────────┬─────────────────────────────┘
                            │ Filtered DataFrame
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Ocean Analytics Engine                  │
│  - Thermocline Gradient Zone Detection                  │
│  - Salinity Regime Classification                       │
│  - Multi-Year Comparative Delta & Trend Calculation     │
└───────────────────────────┬─────────────────────────────┘
              │                             │
              ▼                             ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│   Visualization Engine    │ │   Data-Driven Synthesizer │
│  - Inverted Depth Profile │ │  - Plain-Text Summaries   │
│  - Temperature Histogram  │ │  - Structured Findings    │
│  - T-S Diagram            │ │  - GDAC Source Citations  │
│  - Multi-Year Overlay     │ └───────────────────────────┘
└─────────────┬─────────────┘               │
              └──────────────┬──────────────┘
                             ▼
              JSON Response with Plotly Specs
```

---

## 🔑 Environment Keys & Configuration

FloatChat is designed to work seamlessly out-of-the-box using deterministic scientific synthesis, while offering full integration with external LLM providers, relational databases, and vector stores.

Below is the complete list of environment keys supported by the system:

| Variable Name | Required? | Default / Example Value | Description |
| :--- | :--- | :--- | :--- |
| `OPENAI_API_KEY` | Optional | `sk-proj-...` | Enables OpenAI models (`gpt-4o-mini`, `gpt-4o`) via LiteLLM synthesis. If omitted, FloatChat uses internal data-driven scientific synthesizer. |
| `ANTHROPIC_API_KEY` | Optional | `sk-ant-api...` | Enables Anthropic models (`claude-3-5-sonnet`) via LiteLLM. |
| `GEMINI_API_KEY` | Optional | `AIzaSy...` | Enables Google Gemini models (`gemini-2.5-flash`) via LiteLLM. |
| `DATABASE_URL` | Optional | `postgresql+asyncpg://postgres:postgres@localhost:5432/floatchat` | PostgreSQL + PostGIS database connection string for persistent float metadata indexing. |
| `REDIS_URL` | Optional | `redis://localhost:6379/0` | Redis caching connection for high-speed query response caching. |
| `VECTOR_DB_URL` | Optional | `http://localhost:8000/chroma` | Vector database URL for ChromaDB hybrid semantic retrieval. |
| `VECTOR_DB_COLLECTION` | Optional | `argo_embeddings` | Target ChromaDB collection name for oceanographic paper/profile embeddings. |
| `PARQUET_DATA_DIR` | Optional | `./SIH2025/Data/argo_prototype_parquet` | Path to directory containing monthly ARGO Parquet dataset files. |
| `METADATA_CSV_PATH` | Optional | `./SIH2025/Data/argo_metadata_catalog.csv` | Path to CSV catalog file containing min/max bounding box metadata. |
| `PORT` | Optional | `8000` | Backend FastAPI server port. |
| `VITE_API_BASE_URL` | Optional | `http://127.0.0.1:8000/api/v1` | Frontend connection URL for the FloatChat backend REST API. |
| `LOG_LEVEL` | Optional | `INFO` | System logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`). |
| `ENVIRONMENT` | Optional | `development` | Deployment environment (`development`, `testing`, `production`). |

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ (Python 3.11 or 3.13 recommended)
- Node.js 18+ & npm
- Git

### 1. Clone & Set Up Backend

```bash
# Clone repository
git clone https://github.com/Akash-paluvai/FloatChatAI.git
cd FloatChatAI

# Set up Python virtual environment
cd backend
python3 -m venv .venv
source .venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Start FastAPI dev server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend server will run at `http://127.0.0.1:8000`. You can inspect the interactive OpenAPI Swagger UI at `http://127.0.0.1:8000/api/v1/docs`.

### 2. Set Up Frontend

In a new terminal window:

```bash
cd remix_-floatchat---ai-ocean-data-explorer

# Install frontend dependencies
npm install

# Launch Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser to launch **FloatChat AI Explorer**.

---

## 📊 Scientific Query Capabilities (Notebook Parity)

FloatChat directly reproduces the scientific analytical capabilities developed in the original Jupyter research notebooks:

1. **Temperature & Depth Profiling**: Inverted depth profile curves ($0\text{m} \to 2000\text{m}$) with automatically detected thermocline gradient boundaries.
2. **Salinity & Hydrological Regimes**: Identifies High Salinity Water (e.g. Arabian Sea ASHSW) vs Riverine-influenced Low Salinity Layers (Bay of Bengal).
3. **Multi-Year Comparisons**: Computes exact inter-annual temperature and salinity deltas with trend direction (e.g., 2022 vs 2024 cooling/warming analysis).
4. **T-S Diagrams**: Temperature-Salinity correlation scatter plots to trace ocean water mass signatures.
5. **Interactive Dashboard**: Global overview metrics, monthly Parquet file dataset repository listing, and interactive region explorer.

---

## 📜 API Endpoints Summary

- **`POST /api/v1/chat`**: Primary conversational endpoint. Takes user prompt, runs execution plan over Parquet files, returns Plotly charts, analytics summary, SQL query preview, citations, and plain-language summary.
- **`GET /api/v1/dashboard/summary`**: Aggregates catalog-wide statistics across 36 monthly Parquet files (~54M observations).
- **`GET /api/v1/dashboard/region-stats/{region_name}`**: Computes live real-data statistics for specific ocean regions (Bay of Bengal, Arabian Sea, Southern Ocean, etc.).
- **`GET /api/v1/health`**: Diagnostic system health check endpoint.

---

## 📁 Repository Structure

```
FloatChatAI/
├── backend/                               # FastAPI Backend Application
│   ├── app/
│   │   ├── api/                           # REST API Endpoints (chat, dashboard, analytics, etc.)
│   │   ├── ai/                            # Execution Engine & LLM Synthesizer
│   │   ├── services/scientific/           # Data Pipeline, Query Planner, Analytics & Viz Engines
│   │   └── config/                        # Pydantic Configuration & Settings
│   ├── tests/                             # Benchmark & Unit Tests
│   └── requirements.txt                   # Backend Dependencies
├── remix_-floatchat---ai-ocean-data-explorer/ # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── components/                    # UI Components & Plotly Chart Renderers
│   │   ├── pages/                         # DemoPage, DashboardPage, LandingPage
│   │   └── services/                      # API Communication Services
│   └── package.json                       # Frontend Dependencies
├── SIH2025/                               # Scientific Parquet Data Archives & Metadata Catalog
├── notebooks/                             # Scientific Reference Implementation Notebooks
├── ARCHITECTURE.md                        # Architectural Deep Dive
├── README.md                              # Main Documentation (This File)
└── .env.example                           # Sample Environment Variable Configuration
```

---

## 📄 License & Citations
Data sourced from the **ARGO Global Data Assembly Center (GDAC)**. Developed for open-science oceanographic research and interactive exploration.
