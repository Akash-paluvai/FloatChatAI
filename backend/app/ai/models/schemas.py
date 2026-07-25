"""Structured Output Schemas for Tool Execution Results."""
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class ScientificQueryResult(BaseModel):
    query_id: str
    ocean_region: str
    floats_count: int
    profiles_count: int
    sample_records: List[Dict[str, Any]] = Field(default_factory=list)


class StatisticsResult(BaseModel):
    ocean_region: str
    mean_temperature_c: float
    stddev_temperature_c: float
    min_temperature_c: float
    max_temperature_c: float
    total_observations: int


class RetrievalResult(BaseModel):
    intent: Dict[str, Any]
    retrieved_chunks_count: int
    context_blocks: List[str]
    retrieved_contexts: List[Dict[str, Any]]


class VisualizationResult(BaseModel):
    visualization_id: str
    viz_type: str
    ocean_region: str
    plotly_config: Dict[str, Any]


class ExportResult(BaseModel):
    export_id: str
    file_name: str
    file_size: str
    download_url: str


class CitationResult(BaseModel):
    dataset_name: str
    provider: str
    wmo_id: int
    profile_id: str
    coordinates: str
    timestamp: str
    retrieval_score: float
