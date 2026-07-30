"""Main FastAPI Application Entry Point for FloatChat Backend."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from loguru import logger

from app.config.settings import settings
from app.core.constants import APP_NAME, APP_DESCRIPTION, API_V1_PREFIX
from app.core.logging import setup_logging
from app.core.exceptions import register_exception_handlers
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.timing import TimingMiddleware
from app.middleware.logging import StructuredLoggingMiddleware
from app.middleware.security import SecurityHeadersMiddleware

# Import domain API routers
from app.api.system.router import router as system_router
from app.api.chat.router import router as chat_router
from app.api.analytics.router import router as analytics_router
from app.api.datasets.router import router as datasets_router
from app.api.visualization.router import router as visualization_router
from app.api.exports.router import router as exports_router
from app.api.retrieval.router import router as retrieval_router
from app.api.reports.router import agents_router, viz_router, report_router
from app.api.dashboard.router import router as dashboard_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for startup and shutdown events."""
    setup_logging()
    logger.bind(request_id="SYS-START").info(
        f"Starting {APP_NAME} v{settings.VERSION} [{settings.ENVIRONMENT.value}]"
    )
    yield
    logger.bind(request_id="SYS-STOP").info(f"Shutting down {APP_NAME}")


# OpenAPI Tag Metadata for Swagger UI & ReDoc
tags_metadata = [
    {
        "name": "System & Health",
        "description": "API operational readiness, system diagnostics, and version information.",
    },
    {
        "name": "AI Chat & Natural Language",
        "description": "Natural language query translation, conversational chat interface, and SQL previews.",
    },
    {
        "name": "Multi-Agent Intelligence Platform",
        "description": "Distributed supervisor and worker agent fleet execution, discovery, and capability matching.",
    },
    {
        "name": "Ocean Analytics & Queries",
        "description": "Scientific spatial queries, thermocline profiling, and ARGO float retrieval.",
    },
    {
        "name": "Ocean Datasets",
        "description": "Open science dataset repository (ARGO, ERDDAP, Argovis, INCOIS).",
    },
    {
        "name": "Semantic Retrieval Platform",
        "description": "Hybrid BM25 + vector similarity retrieval, metadata filtering, and context assembly.",
    },
    {
        "name": "3D & Profile Visualizations",
        "description": "Plotly configuration generators for 3D hydrographic sections, temperature profiles, and dashboards.",
    },
    {
        "name": "Automated Scientific Reports",
        "description": "Export-ready scientific reports in Markdown, HTML, and PDF formats.",
    },
    {
        "name": "Data Subset Exports",
        "description": "Export oceanographic observation subsets in CSV, Parquet, or GeoJSON formats.",
    },
]

# Initialize FastAPI App
app = FastAPI(
    title=APP_NAME,
    description=APP_DESCRIPTION,
    version=settings.VERSION,
    openapi_url=f"{API_V1_PREFIX}/openapi.json",
    docs_url=f"{API_V1_PREFIX}/docs",
    redoc_url=f"{API_V1_PREFIX}/redoc",
    openapi_tags=tags_metadata,
    lifespan=lifespan,
)

# Custom Exception Handlers
register_exception_handlers(app)

# Register Middlewares (Order: Outer -> Inner)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(StructuredLoggingMiddleware)
app.add_middleware(TimingMiddleware)
app.add_middleware(RequestIDMiddleware)

# Include v1 REST API Routers
app.include_router(system_router, prefix=API_V1_PREFIX)
app.include_router(chat_router, prefix=API_V1_PREFIX)
app.include_router(agents_router, prefix=API_V1_PREFIX)
app.include_router(analytics_router, prefix=API_V1_PREFIX)
app.include_router(datasets_router, prefix=API_V1_PREFIX)
app.include_router(retrieval_router, prefix=API_V1_PREFIX)
app.include_router(viz_router, prefix=API_V1_PREFIX)
app.include_router(report_router, prefix=API_V1_PREFIX)
app.include_router(exports_router, prefix=API_V1_PREFIX)
app.include_router(dashboard_router, prefix=API_V1_PREFIX)


@app.get("/", include_in_schema=False)
async def root():
    return {
        "name": APP_NAME,
        "version": settings.VERSION,
        "docs_url": f"{API_V1_PREFIX}/docs",
        "health_url": f"{API_V1_PREFIX}/health",
    }
