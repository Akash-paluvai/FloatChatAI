"""Visualization schemas."""
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class VisualizationRequest(BaseModel):
    title: str = Field(default="Temperature Profile vs Depth", json_schema_extra={"example": "Bay of Bengal Depth Profile"})
    viz_type: str = Field(default="temperature_profile", json_schema_extra={"example": "temperature_profile"})
    ocean_region: str = Field(default="Bay of Bengal", json_schema_extra={"example": "Bay of Bengal"})
    wmo_id: Optional[int] = Field(default=2901234)


class VisualizationResponse(BaseModel):
    visualization_id: str
    viz_type: str
    ocean_region: str
    plotly_config: Dict[str, Any] = Field(default_factory=dict)
