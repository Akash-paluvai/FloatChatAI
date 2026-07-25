"""PostGIS SpatialQueryService using GeoAlchemy2 ST_DWithin, ST_MakeEnvelope, & ST_Contains."""
from typing import List, Optional, Dict, Any
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from geoalchemy2.functions import ST_DWithin, ST_MakeEnvelope, ST_Contains, ST_SetSRID, ST_Point
from app.database.models.profile import ProfileModel
from app.database.models.region import OceanRegionModel


class SpatialQueryService:
    """High-performance PostGIS geospatial query engine."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def search_radius(self, lat: float, lon: float, radius_km: float = 100.0, limit: int = 100) -> List[ProfileModel]:
        """Search profiles within radius (km) using PostGIS ST_DWithin on WGS84 geography."""
        point_geom = func.ST_SetSRID(func.ST_MakePoint(lon, lat), 4326)
        radius_meters = radius_km * 1000.0

        stmt = select(ProfileModel).where(
            func.ST_DWithin(ProfileModel.location, point_geom, radius_meters)
        ).limit(limit)

        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def search_bounding_box(self, min_lat: float, max_lat: float, min_lon: float, max_lon: float, limit: int = 100) -> List[ProfileModel]:
        """Search profiles within bounding box envelope."""
        envelope = func.ST_MakeEnvelope(min_lon, min_lat, max_lon, max_lat, 4326)

        stmt = select(ProfileModel).where(
            func.ST_Contains(envelope, ProfileModel.location)
        ).limit(limit)

        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def search_ocean_region(self, region_code: str, limit: int = 100) -> List[ProfileModel]:
        """Spatial join profiles intersecting OceanRegion polygon."""
        stmt = select(ProfileModel).join(
            OceanRegionModel,
            func.ST_Contains(OceanRegionModel.geometry, ProfileModel.location)
        ).where(OceanRegionModel.code == region_code).limit(limit)

        result = await self.session.execute(stmt)
        return list(result.scalars().all())
