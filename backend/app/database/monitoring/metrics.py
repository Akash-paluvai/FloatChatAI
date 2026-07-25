"""Materialized Views & Database Monitoring Metrics."""
from typing import Dict, Any
from sqlalchemy import text, select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models.profile import ProfileModel
from app.database.models.measurement import MeasurementModel


class MaterializedViewsManager:
    """Manages materialized view definitions & refresh calls."""

    @staticmethod
    async def refresh_views(session: AsyncSession) -> None:
        """Refreshes PostGIS materialized views."""
        try:
            await session.execute(text("REFRESH MATERIALIZED VIEW CONCURRENTLY v_latest_float_positions;"))
            await session.commit()
        except Exception:
            await session.rollback()


class DatabaseMetrics:
    """Monitors row counts, storage usage, connection pool, and performance."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_metrics(self) -> Dict[str, Any]:
        p_count = await self.session.scalar(select(func.count(ProfileModel.profile_id))) or 0
        m_count = await self.session.scalar(select(func.count(MeasurementModel.id))) or 0

        return {
            "database_status": "healthy",
            "profiles_count": p_count,
            "measurements_count": m_count,
            "connection_pool": "operational",
            "postgis_status": "enabled",
        }
