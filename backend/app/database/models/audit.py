"""Audit history models (LoadHistory, QueryHistory, ImportHistory, ExportHistory)."""
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Float, JSON
from app.database.base import Base


class LoadHistory(Base):
    __tablename__ = "audit_load_history"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    dataset_name: Mapped[str] = mapped_column(String(100), nullable=False)
    source_file: Mapped[str] = mapped_column(String(255), nullable=False)
    records_loaded: Mapped[int] = mapped_column(Integer, default=0)
    duration_ms: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(20), default="COMPLETED")
    ingestion_version: Mapped[str] = mapped_column(String(20), default="v1.0.0")


class QueryHistory(Base):
    __tablename__ = "audit_query_history"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    query_type: Mapped[str] = mapped_column(String(50), nullable=False)
    query_params: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    execution_time_ms: Mapped[float] = mapped_column(Float, default=0.0)
    rows_returned: Mapped[int] = mapped_column(Integer, default=0)


class ExportHistory(Base):
    __tablename__ = "audit_export_history"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    export_format: Mapped[str] = mapped_column(String(20), nullable=False)
    ocean_region: Mapped[str] = mapped_column(String(100), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="COMPLETED")
