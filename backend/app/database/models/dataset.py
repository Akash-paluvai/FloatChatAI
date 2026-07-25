"""Dataset model."""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, BigInteger
from app.database.base import Base


class DatasetModel(Base):
    """Scientific Dataset entity model."""
    __tablename__ = "datasets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    source: Mapped[str] = mapped_column(String(50), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    record_count: Mapped[int] = mapped_column(BigInteger, default=0)
    file_size_bytes: Mapped[int] = mapped_column(BigInteger, default=0)
    format: Mapped[str] = mapped_column(String(20), default="Parquet")
    status: Mapped[str] = mapped_column(String(20), default="Ready")
    schema_version: Mapped[str] = mapped_column(String(20), default="v1.0.0")
    dataset_version: Mapped[str] = mapped_column(String(20), default="v1.0.0")
