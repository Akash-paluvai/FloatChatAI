"""TimeSeriesService and AggregationEngine for spatial-temporal ocean observations."""
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models.profile import ProfileModel
from app.database.models.measurement import MeasurementModel


class TimeSeriesService:
    """High-speed spatial-temporal time series query engine."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_time_series(
        self,
        start_date: datetime,
        end_date: datetime,
        min_depth: float = 0.0,
        max_depth: float = 2000.0,
        wmo_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        stmt = select(
            ProfileModel.profile_id,
            ProfileModel.timestamp,
            ProfileModel.latitude,
            ProfileModel.longitude,
            MeasurementModel.depth_m,
            MeasurementModel.value,
            MeasurementModel.qc_flag
        ).join(
            MeasurementModel, ProfileModel.profile_id == MeasurementModel.profile_id
        ).where(
            and_(
                ProfileModel.timestamp >= start_date,
                ProfileModel.timestamp <= end_date,
                MeasurementModel.depth_m >= min_depth,
                MeasurementModel.depth_m <= max_depth
            )
        )

        if wmo_id:
            stmt = stmt.where(ProfileModel.float_wmo_id == wmo_id)

        result = await self.session.execute(stmt)
        rows = result.all()

        return [
            {
                "profile_id": r.profile_id,
                "timestamp": r.timestamp.isoformat() if hasattr(r.timestamp, "isoformat") else str(r.timestamp),
                "latitude": r.latitude,
                "longitude": r.longitude,
                "depth_m": r.depth_m,
                "value": r.value,
                "qc_flag": r.qc_flag
            }
            for r in rows
        ]


class AggregationEngine:
    """Computes daily, monthly, and regional ocean observation aggregates."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_monthly_temperature_averages(self, year: int) -> List[Dict[str, Any]]:
        stmt = select(
            func.extract('month', ProfileModel.timestamp).label('month'),
            func.avg(MeasurementModel.value).label('avg_value'),
            func.min(MeasurementModel.value).label('min_value'),
            func.max(MeasurementModel.value).label('max_value'),
            func.count(MeasurementModel.id).label('count')
        ).join(
            MeasurementModel, ProfileModel.profile_id == MeasurementModel.profile_id
        ).where(
            func.extract('year', ProfileModel.timestamp) == year
        ).group_by(
            func.extract('month', ProfileModel.timestamp)
        ).order_by('month')

        result = await self.session.execute(stmt)
        return [
            {
                "month": int(r.month),
                "avg_value": round(float(r.avg_value), 2) if r.avg_value else 0.0,
                "min_value": round(float(r.min_value), 2) if r.min_value else 0.0,
                "max_value": round(float(r.max_value), 2) if r.max_value else 0.0,
                "count": r.count
            }
            for r in result.all()
        ]
