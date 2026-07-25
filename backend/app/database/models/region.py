"""OceanRegion model with PostGIS Geometry."""
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Boolean, JSON
from geoalchemy2 import Geometry
from app.database.base import Base


class OceanRegionModel(Base):
    """Ocean Region model with PostGIS Polygon geometry, EEZ, & Climate Zone attributes."""
    __tablename__ = "ocean_regions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    geometry = mapped_column(Geometry("POLYGON", srid=4326), nullable=True)
    bbox: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    eez: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ocean: Mapped[str] = mapped_column(String(100), nullable=False)
    sub_ocean: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    climate_zone: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
