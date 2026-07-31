# 🔑 FloatChat AI — Environment Keys & Variables Reference

FloatChat AI is designed with a **flexible configuration architecture**. It runs completely offline using internal data-driven scientific synthesis by default, while supporting seamless integration with external LLM providers (OpenAI, Anthropic, Gemini, Ollama), relational databases (PostgreSQL/PostGIS), vector stores (ChromaDB), and Redis caches.

---

## 📋 Master Environment Variables Table

| Key | Mandatory? | Default Value | Category | Description |
| :--- | :--- | :--- | :--- | :--- |
| `OPENAI_API_KEY` | Optional | `None` | AI / LLM | OpenAI API Key for LiteLLM completion (`gpt-4o-mini`, `gpt-4o`). If omitted, uses internal data-driven synthesizer. |
| `ANTHROPIC_API_KEY` | Optional | `None` | AI / LLM | Anthropic API Key for Claude models (`claude-3-5-sonnet`). |
| `GEMINI_API_KEY` | Optional | `None` | AI / LLM | Google Gemini API Key (`gemini-2.5-flash`). |
| `DATABASE_URL` | Optional | `postgresql+asyncpg://postgres:postgres@localhost:5432/floatchat` | Database | PostgreSQL + PostGIS connection string for persistent float metadata indexing. |
| `REDIS_URL` | Optional | `redis://localhost:6379/0` | Cache | Redis connection string for response caching. |
| `VECTOR_DB_URL` | Optional | `http://localhost:8000/chroma` | Vector Store | ChromaDB endpoint for vector search. |
| `VECTOR_DB_COLLECTION` | Optional | `argo_embeddings` | Vector Store | ChromaDB collection name for ARGO metadata embeddings. |
| `PARQUET_DATA_DIR` | Config | `./SIH2025/Data/argo_prototype_parquet` | Storage | Directory path containing monthly ARGO Parquet dataset files. |
| `METADATA_CSV_PATH` | Config | `./SIH2025/Data/argo_metadata_catalog.csv` | Storage | Path to CSV catalog containing bounding box metadata. |
| `PORT` | Config | `8000` | Server | Backend FastAPI server port. |
| `VITE_API_BASE_URL` | Config | `http://127.0.0.1:8000/api/v1` | Frontend | API URL consumed by the React/Vite frontend. |
| `LOG_LEVEL` | Config | `INFO` | Logging | Logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`). |
| `ENVIRONMENT` | Config | `development` | System | Environment mode (`development`, `testing`, `production`). |
| `SECRET_KEY` | Config | `floatchat-super-secret-key-2026` | Security | Secret key for session encryption. |

---

## 🛠️ Sample `.env` Template

Create a `.env` file in the root directory or inside `backend/`:

```ini
# --- LLM API Keys ---
OPENAI_API_KEY=sk-proj-your-key-here
ANTHROPIC_API_KEY=
GEMINI_API_KEY=

# --- Database & Cache ---
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/floatchat
REDIS_URL=redis://localhost:6379/0

# --- File Paths ---
PARQUET_DATA_DIR=./SIH2025/Data/argo_prototype_parquet
METADATA_CSV_PATH=./SIH2025/Data/argo_metadata_catalog.csv

# --- Server Ports ---
PORT=8000
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
ENVIRONMENT=development
LOG_LEVEL=INFO
SECRET_KEY=floatchat-secret-key-2026
```
