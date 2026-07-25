"""Normalized Dynamic EAV MeasurementModel."""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Float, ForeignKey, BigInteger
from app.database.base import Base


class MeasurementModel(Base):
    """Dynamic Normalized EAV Measurement model (profile_id, variable_id, value, unit_id, qc_flag)."""
    __tablename__ = "measurements"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    profile_id: Mapped[str] = mapped_column(String(64), ForeignKey("profiles.profile_id"), nullable=False, index=True)
    variable_id: Mapped[str] = mapped_column(String(36), ForeignKey("variables.id"), nullable=False, index=True)
    unit_id: Mapped[str] = mapped_column(String(36), ForeignKey("units.id"), nullable=False)
    depth_m: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    qc_flag: Mapped[int] = mapped_column(Integer, default=1)
