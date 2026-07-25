"""Chat schemas for natural language query interface."""
from typing import List, Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        json_schema_extra={"example": "Show temperature near Bay of Bengal"},
        description="Natural language query prompt"
    )
    ocean_region: Optional[str] = Field(default=None, json_schema_extra={"example": "Bay of Bengal"})
    max_depth_m: Optional[float] = Field(default=2000.0)


class AnalyticalSummary(BaseModel):
    avg_temp: str = Field(default="28.3°C (Surface)")
    max_depth: str = Field(default="2,000 meters")
    salinity_range: str = Field(default="33.2 – 35.0 PSU")
    anomaly_detected: bool = Field(default=False)


class ChatResponse(BaseModel):
    status: str = Field(default="Phase 3 AI Integration Pending", description="Processing status label")
    response_text: str = Field(
        default="[Demo Preview] FloatChat backend retrieved 1,000 ARGO depth profiles."
    )
    sql_query_preview: Optional[str] = Field(
        default="SELECT depth_m, temp_celsius, salinity_psu FROM argo_profiles WHERE ocean_region = 'Bay of Bengal' ORDER BY depth_m ASC LIMIT 1000;"
    )
    analytical_summary: Optional[AnalyticalSummary] = Field(default_factory=AnalyticalSummary)
    suggested_followups: List[str] = Field(
        default_factory=lambda: [
            "Compare profile with 2022 historic baseline",
            "Download GeoJSON dataset for these floats",
            "Analyze thermocline gradient depth between 100m–300m"
        ]
    )
