# 🛠️ FloatChat AI — Complete Installation & Setup Guide

This guide provides step-by-step instructions to set up, configure, run, and deploy the **FloatChat AI Ocean Data Explorer** on your local machine or server.

---

## 📋 System Prerequisites

Before starting, ensure your system meets the following software requirements:

| Component | Minimum Version | Recommended Version | Note |
| :--- | :--- | :--- | :--- |
| **Python** | 3.10+ | 3.11 or 3.13 | Required for Backend API |
| **Node.js** | 18.0+ | 20.0+ | Required for Frontend Vite app |
| **npm / yarn** | 9.0+ | 10.0+ | Node package manager |
| **Git** | 2.30+ | Latest | Version control |
| **Docker & Compose** | *(Optional)* | 24.0+ | For containerized setup |

---

## 🚀 Quick Setup (Standard Development Mode)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Akash-paluvai/FloatChatAI.git
cd FloatChatAI
```

---

### Step 2: Set Up Backend (FastAPI + PyArrow Data Pipeline)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:
   ```bash
   # macOS / Linux
   python3 -m venv .venv
   source .venv/bin/activate

   # Windows (PowerShell)
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```

3. Install required Python packages:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. Create environment configuration (`.env`):
   ```bash
   cp .env.example .env
   ```

5. Launch the FastAPI backend server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

   - **Interactive Swagger OpenAPI Docs**: [http://127.0.0.1:8000/api/v1/docs](http://127.0.0.1:8000/api/v1/docs)
   - **System Health Check Endpoint**: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
   - **Dashboard Summary Endpoint**: [http://127.0.0.1:8000/api/v1/dashboard/summary](http://127.0.0.1:8000/api/v1/dashboard/summary)

---

### Step 3: Set Up Frontend (React 19 + Vite + Plotly)

Open a **new terminal window** and navigate to the frontend directory:

```bash
cd FloatChatAI/remix_-floatchat---ai-ocean-data-explorer
```

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Environment Configuration Guide

FloatChat operates with zero external dependencies by default using deterministic scientific data synthesis. You can optionally configure external LLMs, database connections, and custom data directories in `backend/.env`:

```ini
# ==============================================================================
# AI & LLM Provider Keys (Optional: FloatChat uses data-driven fallback if omitted)
# ==============================================================================
OPENAI_API_KEY=sk-proj-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-api-your-anthropic-key-here
GEMINI_API_KEY=AIzaSy-your-gemini-key-here

# ==============================================================================
# Database & Cache Settings (Optional)
# ==============================================================================
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/floatchat
REDIS_URL=redis://localhost:6379/0

# ==============================================================================
# Data File Paths
# ==============================================================================
PARQUET_DATA_DIR=../SIH2025/Data/argo_prototype_parquet
METADATA_CSV_PATH=../SIH2025/Data/argo_metadata_catalog.csv

# ==============================================================================
# Server Ports & Settings
# ==============================================================================
PORT=8000
ENVIRONMENT=development
LOG_LEVEL=INFO
SECRET_KEY=floatchat-super-secret-key-2026
```

---

## 🐳 Running with Docker Compose (Containerized Setup)

If you prefer containerized deployment with Docker:

```bash
# Build and run containers in background
docker-compose up --build -d

# View container logs
docker-compose logs -f

# Stop containers
docker-compose down
```

- **Backend Container**: Listening on port `8000`
- **Frontend Container**: Listening on port `5173` (or `80`)

---

## 🧪 Testing & Verification

### Running Backend Unit & Benchmark Tests

```bash
cd backend
source .venv/bin/activate
PYTHONPATH=. pytest -v
```

### Testing API Endpoints via Curl

```bash
# 1. Health check
curl -s http://127.0.0.1:8000/api/v1/health

# 2. Dashboard summary
curl -s http://127.0.0.1:8000/api/v1/dashboard/summary

# 3. Regional stats (Bay of Bengal)
curl -s "http://127.0.0.1:8000/api/v1/dashboard/region-stats/Bay%20of%20Bengal"

# 4. Natural language query chat execution
curl -s -X POST http://127.0.0.1:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show temperature near Bay of Bengal"}'
```

---

## ❓ Troubleshooting & FAQs

### Q1: `ModuleNotFoundError` when running backend?
Ensure your virtual environment is activated (`source .venv/bin/activate`) and you have installed dependencies (`pip install -r requirements.txt`).

### Q2: Frontend fails to connect to backend?
Verify backend is running on `http://127.0.0.1:8000`. Test `curl http://127.0.0.1:8000/api/v1/health` in terminal. Ensure `VITE_API_BASE_URL` points to `http://127.0.0.1:8000/api/v1`.

### Q3: Missing Parquet files?
Ensure Parquet datasets exist in `SIH2025/Data/argo_prototype_parquet/`. FloatChat automatically discovers and prunes any `.parquet` files in that folder.
