"""Dataset schemas."""
from typing import List, Optional
from pydantic import BaseModel, Field


class DatasetInfo(BaseModel):
    id: str = Field(..., json_schema_extra={"example": "ds-101"})
    name: str = Field(..., json_schema_extra={"example": "ARGO Bay of Bengal 2024 Filtered"})
    source: str = Field(..., json_schema_extra={"example": "ARGO"})
    year: int = Field(..., json_schema_extra={"example": 2024})
    record_count: str = Field(..., json_schema_extra={"example": "482,000"})
    file_size: str = Field(..., json_schema_extra={"example": "3.1 GB"})
    format: str = Field(..., json_schema_extra={"example": "Parquet"})
    status: str = Field(default="Ready", json_schema_extra={"example": "Ready"})
    download_url: Optional[str] = Field(default=None)


class DatasetListResponse(BaseModel):
    total_datasets: int
    datasets: List[DatasetInfo]
