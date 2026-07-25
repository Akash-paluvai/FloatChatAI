"""ProfileModel with PostGIS Point location geometry & Vector compatibility columns."""
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Boolean
from geoalchemy2 import Geometry
from app.database.base import Base


class ProfileModel(Base):
    """Oceanographic Depth Profile entity model with PostGIS Point geometry & future vector embedding fields."""
    __tablename__ = "profiles"

    profile_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    float_wmo_id: Mapped[int] = mapped_column(Integer, ForeignKey("floats.wmo_id"), nullable=False, index=True)
    cycle_number: Mapped[int] = mapped_column(Integer, default=1)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    location = mapped_column(Geometry("POINT", srid=4326), nullable=True)
    max_depth_m: Mapped[float] = mapped_column(Float, default=2000.0)

    # Future Vector DB Compatibility (Phase 5 ready)
    vector_reference: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    embedding_status: Mapped[Optional[str]] = mapped_column(String(20), default="pending", nullable=True)
    indexed: Mapped[bool] = mapped_column(Boolean, default=False)
    embedding_version: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
