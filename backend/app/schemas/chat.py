"""Chat schemas for natural language query interface."""
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: Optional[str] = Field(
        default=None,
        json_schema_extra={"example": "Show temperature near Bay of Bengal"},
        description="Natural language query prompt"
    )
    prompt: Optional[str] = Field(
        default=None,
        description="Alternative prompt field name"
    )
    session_id: Optional[str] = Field(default="session_default")
    ocean_region: Optional[str] = Field(default=None, json_schema_extra={"example": "Bay of Bengal"})
    max_depth_m: Optional[float] = Field(default=2000.0)

    def get_prompt_text(self) -> str:
        return self.prompt or self.message or "Show temperature near Bay of Bengal"


class AnalyticalSummary(BaseModel):
    avg_temp: Optional[str] = Field(default="28.3°C (Surface)")
    max_depth: Optional[str] = Field(default="2,000 meters")
    salinity_range: Optional[str] = Field(default="33.2 – 35.0 PSU")
    thermocline_gradient_depth: Optional[str] = Field(default="75m – 200m")
    spatial_centroid: Optional[str] = Field(default="15.5°N, 88.2°E")
    total_observations: Optional[int] = Field(default=50)
    anomaly_detected: bool = Field(default=False)


class ChatResponse(BaseModel):
    session_id: str = Field(default="session_default")
    message_id: str = Field(default="msg_ai_101")
    status: str = Field(default="PROCESSED_BY_AI_ORCHESTRATOR", description="Processing status label")
    response_text: str = Field(
        default="[FloatChat AI] Retrieved ARGO depth profiles."
    )
    content: Optional[str] = Field(default=None)
    generated_sql: Optional[str] = Field(
        default="SELECT depth_m, temp_celsius FROM argo_profiles WHERE ocean_region = 'Bay of Bengal' LIMIT 500;"
    )
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    confidence_score: float = Field(default=0.94)
    sources: List[str] = Field(default_factory=lambda: ["ARGO GDAC", "Phase 5 Semantic Retrieval", "PostgreSQL/PostGIS"])
    analytical_summary: Optional[Dict[str, Any]] = Field(default_factory=dict)
    viz_spec: Optional[Dict[str, Any]] = Field(default=None)
    artifacts: Optional[Dict[str, Any]] = Field(default=None)
    suggested_followups: List[str] = Field(
        default_factory=lambda: [
            "Compare profile with 2022 historic baseline",
            "Download GeoJSON dataset for these floats",
            "Analyze thermocline gradient depth between 100m–300m"
        ]
    )
