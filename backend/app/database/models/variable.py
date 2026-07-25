"""Scientific Variable catalog model."""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from app.database.base import Base


class VariableModel(Base):
    """Scientific Variable catalog table (Temperature, Salinity, Pressure, Oxygen, Chlorophyll, Nitrate)."""
    __tablename__ = "variables"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    standard_name: Mapped[str] = mapped_column(String(100), nullable=True)
