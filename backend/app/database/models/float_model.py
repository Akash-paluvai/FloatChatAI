"""FloatModel representation."""
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, ForeignKey
from app.database.base import Base


class FloatModel(Base):
    """ARGO Float Platform entity model."""
    __tablename__ = "floats"

    wmo_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    dataset_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("datasets.id"), nullable=True)
    ocean_region_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("ocean_regions.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="active")
    ocean_region: Mapped[str] = mapped_column(String(100), default="Bay of Bengal")
