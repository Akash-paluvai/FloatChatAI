# FloatChat Backend API 🌊

FloatChat is an AI-powered oceanographic platform for querying ARGO oceanographic data using natural language.

> **Phase 2 Complete**: Production-grade FastAPI backend platform architecture with domain-driven design, Pydantic v2 schemas, provider abstractions, SQLAlchemy 2.x async session setup, Alembic migrations config, Loguru logging, correlation IDs, standardized envelope responses, Pytest test suite, and Docker containerization.

---

## 🏗️ Architecture & Layering

```
backend/
├── app/
│   ├── api/             # Domain-grouped API gateways (chat, datasets, analytics, visualization, exports, system)
│   ├── config/          # Pydantic BaseSettings & Environment configuration
│   ├── core/            # Loguru logging, exception handling, constants
│   ├── database/        # SQLAlchemy 2.x async engine, sessionmaker, Alembic migrations
│   ├── dependencies/    # FastAPI dependency injection (context, pagination, auth, cache)
│   ├── domain/          # Entities (OceanProfile, Float, Dataset, Measurement), Value Objects, Domain Services
│   ├── events/          # Async event bus pub/sub system
│   ├── middleware/      # RequestID (Correlation ID), Timing, Structured Logging, Security Headers, GZip
│   ├── providers/       # Infrastructure provider abstractions (DatabaseProvider, StorageProvider, VectorProvider, CacheProvider, FileProvider)
│   ├── repositories/    # Abstract repositories (DatasetRepository, FloatRepository, ProfileRepository, etc.)
│   ├── schemas/         # Pydantic v2 DTOs & standardized APIResponse[T] envelope
│   ├── services/        # Application business services layer
│   ├── utils/           # Enums, helpers, pagination validators
│   ├── workers/         # Background task worker scheduler & jobs skeleton
│   └── main.py          # FastAPI application entry point
├── tests/               # Pytest suite with AsyncClient fixtures
├── Dockerfile           # Multi-stage security-hardened container
├── docker-compose.yml   # Multi-container setup (Backend + PostgreSQL + Redis)
├── pyproject.toml       # Code formatting config (Ruff, Black, isort, mypy)
└── alembic.ini          # Alembic database migration configuration
```

---

## 🚀 Running Locally

### 1. Create Environment & Install Dependencies
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Start FastAPI Dev Server
```bash
uvicorn app.main:app --reload --port 8000
```
- Interactive OpenAPI Docs: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- ReDoc Docs: [http://localhost:8000/api/v1/redoc](http://localhost:8000/api/v1/redoc)
- Health Check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## 🧪 Testing & Code Quality

Run tests:
```bash
PYTHONPATH=. pytest -v
```

Format and lint:
```bash
black app tests
isort app tests
ruff check app tests
```

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```
