"""TimeSeriesRepository for time-series queries."""
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.timeseries.timeseries_service import TimeSeriesService


class TimeSeriesRepository:
    def __init__(self, session: Optional[AsyncSession] = None):
        self.session = session

    async def query_time_series(self, start_date: datetime, end_date: datetime, wmo_id: Optional[int] = None) -> List[Dict[str, Any]]:
        if not self.session:
            return [
                {"timestamp": "2024-01-15T00:00:00Z", "depth_m": 0.0, "value": 28.5, "qc_flag": 1},
                {"timestamp": "2024-01-15T00:00:00Z", "depth_m": 100.0, "value": 24.1, "qc_flag": 1},
            ]
        svc = TimeSeriesService(self.session)
        return await svc.get_time_series(start_date, end_date, wmo_id=wmo_id)
