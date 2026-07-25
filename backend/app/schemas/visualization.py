"""Visualization schemas."""
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class VisualizationRequest(BaseModel):
    title: str = Field(default="Temperature Profile vs Depth", example="Bay of Bengal Depth Profile")
    viz_type: str = Field(default="temperature_profile", example="temperature_profile")
    ocean_region: str = Field(default="Bay of Bengal", example="Bay of Bengal")
    wmo_id: Optional[int] = Field(default=2901234)


class VisualizationResponse(BaseModel):
    visualization_id: str
    viz_type: str
    ocean_region: str
    plotly_config: Dict[str, Any] = Field(default_factory=dict)
