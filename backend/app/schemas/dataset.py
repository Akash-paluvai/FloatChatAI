"""Dataset schemas."""
from typing import List, Optional
from pydantic import BaseModel, Field


class DatasetInfo(BaseModel):
    id: str = Field(..., example="ds-101")
    name: str = Field(..., example="ARGO Bay of Bengal 2024 Filtered")
    source: str = Field(..., example="ARGO")
    year: int = Field(..., example=2024)
    record_count: str = Field(..., example="482,000")
    file_size: str = Field(..., example="3.1 GB")
    format: str = Field(..., example="Parquet")
    status: str = Field(default="Ready", example="Ready")
    download_url: Optional[str] = Field(default=None)


class DatasetListResponse(BaseModel):
    total_datasets: int
    datasets: List[DatasetInfo]
