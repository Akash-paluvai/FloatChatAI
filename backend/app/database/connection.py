"""SQLAlchemy 2.x async engine configuration."""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from app.config.settings import settings

# Create async engine with connection pooling
async_engine: AsyncEngine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_pre_ping=True,
    future=True,
)
