# FloatChat Backend API 🌊

FloatChat Backend is a FastAPI-powered scientific REST API designed to process, analyze, and visualize real ARGO float oceanographic observations (~54 Million data points across 36 monthly Parquet datasets).

---

## 🔑 Required & Supported Environment Keys

FloatChat can run in a self-contained offline mode using internal data-driven scientific synthesis, or connect to external LLM APIs, vector stores, and relational databases.

| Key | Type | Description |
| :--- | :--- | :--- |
| `OPENAI_API_KEY` | Optional | OpenAI API Key for LiteLLM completion (`gpt-4o-mini`, `gpt-4o`). |
| `ANTHROPIC_API_KEY` | Optional | Anthropic API Key for Claude models (`claude-3-5-sonnet`). |
| `GEMINI_API_KEY` | Optional | Google Gemini API Key (`gemini-2.5-flash`). |
| `DATABASE_URL` | Optional | PostgreSQL/PostGIS connection string. |
| `REDIS_URL` | Optional | Redis caching connection string. |
| `VECTOR_DB_URL` | Optional | ChromaDB vector database endpoint. |
| `PARQUET_DATA_DIR` | Config | Path to ARGO Parquet directory (default: `../SIH2025/Data/argo_prototype_parquet`). |
| `METADATA_CSV_PATH` | Config | Path to Metadata CSV Catalog (default: `../SIH2025/Data/argo_metadata_catalog.csv`). |

---

## 🏗️ Architecture & Layering

```
backend/
├── app/
│   ├── api/             # Domain API Gateways (chat, dashboard, analytics, visualization, exports, system)
│   ├── ai/              # Execution Engine & Data-Driven LLM Synthesizer
│   ├── config/          # Pydantic Settings & Environment loader
│   ├── core/            # Loguru logging, exception handling, constants
│   ├── middleware/      # RequestID, Timing, Structured Logging, Security Headers
│   ├── schemas/         # Pydantic v2 DTOs & envelope responses
│   ├── services/
│   │   └── scientific/  # Data Pipeline, Query Planner, Analytics & Viz Engines
│   └── main.py          # FastAPI application entry point
├── tests/               # Pytest suite
└── Dockerfile           # Multi-stage Docker setup
```

---

## 🚀 Running Locally

```bash
# 1. Activate Virtual Environment
source .venv/bin/activate

# 2. Install Dependencies
pip install -r requirements.txt

# 3. Start Server
uvicorn app.main:app --reload --port 8000
```

- Swagger OpenAPI Documentation: [http://127.0.0.1:8000/api/v1/docs](http://127.0.0.1:8000/api/v1/docs)
- Interactive Health Diagnostic: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
- Dashboard Summary API: [http://127.0.0.1:8000/api/v1/dashboard/summary](http://127.0.0.1:8000/api/v1/dashboard/summary)

---

## 🧪 Testing

```bash
PYTHONPATH=. pytest -v
```
