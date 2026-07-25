"""Scientific Unit catalog model."""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Float
from app.database.base import Base


class UnitModel(Base):
    """Scientific Unit catalog table (°C, PSU, m, dbar, mg/m3)."""
    __tablename__ = "units"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    symbol: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    si_unit: Mapped[str] = mapped_column(String(20), nullable=False)
    conversion_factor: Mapped[float] = mapped_column(Float, default=1.0)
