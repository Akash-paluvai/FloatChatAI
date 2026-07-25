"""Ocean & scientific query schemas."""
from typing import List, Optional
from pydantic import BaseModel, Field


class FloatMetadata(BaseModel):
    wmo_id: int = Field(..., example=2901234)
    latitude: float = Field(..., example=15.5)
    longitude: float = Field(..., example=88.2)
    depth_m: float = Field(..., example=10.0)
    temperature_c: float = Field(..., example=28.4)
    salinity_psu: float = Field(..., example=33.2)
    status: str = Field(default="active", example="active")
    ocean_region: str = Field(..., example="Bay of Bengal")


class ProfilePoint(BaseModel):
    depth_m: float
    temperature_c: float
    salinity_psu: float


class ProfileMetadata(BaseModel):
    profile_id: str
    wmo_id: int
    ocean_region: str
    points: List[ProfilePoint] = Field(default_factory=list)


class OceanQueryRequest(BaseModel):
    query_text: Optional[str] = Field(default=None, example="Thermocline gradient in Indian Ocean")
    ocean_region: Optional[str] = Field(default="Bay of Bengal")
    min_depth: float = Field(default=0.0)
    max_depth: float = Field(default=2000.0)
    limit: int = Field(default=100)


class OceanQueryResponse(BaseModel):
    query_id: str
    ocean_region: str
    matched_records: int = 1420
    execution_time_ms: float = 42.5
    floats: List[FloatMetadata] = Field(default_factory=list)
    profile: Optional[ProfileMetadata] = None
