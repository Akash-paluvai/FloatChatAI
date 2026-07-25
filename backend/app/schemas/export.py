"""Export schemas."""
from typing import Optional
from pydantic import BaseModel, Field


class ExportRequest(BaseModel):
    ocean_region: str = Field(default="Bay of Bengal", example="Bay of Bengal")
    export_format: str = Field(default="CSV", example="CSV")  # CSV, Parquet, GeoJSON
    include_salinity: bool = Field(default=True)


class ExportResponse(BaseModel):
    export_id: str
    file_name: str
    file_size: str
    download_url: str
    status: str = Field(default="Completed")
