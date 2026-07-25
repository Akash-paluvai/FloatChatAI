"""Health check response schema."""
from typing import Dict
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(default="operational", json_schema_extra={"example": "operational"})
    app_name: str = Field(..., json_schema_extra={"example": "FloatChat API"})
    version: str = Field(..., json_schema_extra={"example": "1.0.0"})
    environment: str = Field(..., json_schema_extra={"example": "development"})
    uptime_seconds: float = Field(..., json_schema_extra={"example": 124.5})
    dependencies: Dict[str, str] = Field(
        default_factory=lambda: {
            "database": "configured_placeholder",
            "redis_cache": "configured_placeholder",
            "vector_db": "configured_placeholder"
        }
    )
