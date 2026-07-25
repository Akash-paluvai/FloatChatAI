"""FilterBuilder & QueryPlanner (SpatialPlanner, TemporalPlanner, Optimizer)."""
from typing import Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field
from sqlalchemy import select, and_
from geoalchemy2.functions import ST_DWithin, ST_MakeEnvelope, ST_Contains, ST_SetSRID, ST_MakePoint
from app.database.models.profile import ProfileModel
from app.database.models.measurement import MeasurementModel


class QueryPlanSpec(BaseModel):
    """Specification object produced by planner (LLM -> QueryPlanSpec -> SQL)."""
    spatial_mode: str = Field(default="bounding_box")  # bounding_box, radius, region
    lat: float = Field(default=15.5)
    lon: float = Field(default=88.2)
    radius_km: float = Field(default=100.0)
    min_lat: float = Field(default=0.0)
    max_lat: float = Field(default=30.0)
    min_lon: float = Field(default=60.0)
    max_lon: float = Field(default=100.0)
    min_depth: float = Field(default=0.0)
    max_depth: float = Field(default=2000.0)
    limit: int = Field(default=100)


class FilterBuilder:
    """Constructs type-safe SQLAlchemy filters from QueryPlanSpec."""

    @staticmethod
    def build_profile_query(spec: QueryPlanSpec):
        stmt = select(ProfileModel)

        if spec.spatial_mode == "radius":
            point_geom = ST_SetSRID(ST_MakePoint(spec.lon, spec.lat), 4326)
            stmt = stmt.where(ST_DWithin(ProfileModel.location, point_geom, spec.radius_km * 1000.0))
        elif spec.spatial_mode == "bounding_box":
            envelope = ST_MakeEnvelope(spec.min_lon, spec.min_lat, spec.max_lon, spec.max_lat, 4326)
            stmt = stmt.where(ST_Contains(envelope, ProfileModel.location))

        return stmt.limit(spec.limit)


class QueryPlanner:
    """Main Query Planner translating specs into safe executable database statements."""

    @staticmethod
    def plan_query(raw_prompt_params: Dict[str, Any]) -> QueryPlanSpec:
        return QueryPlanSpec(
            spatial_mode=raw_prompt_params.get("mode", "bounding_box"),
            lat=raw_prompt_params.get("lat", 15.5),
            lon=raw_prompt_params.get("lon", 88.2),
            radius_km=raw_prompt_params.get("radius_km", 100.0),
            limit=raw_prompt_params.get("limit", 100)
        )
