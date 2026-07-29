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


class ChatResponse(BaseModel):
    session_id: str = Field(default="session_default")
    message_id: str = Field(default="msg_ai_101")
    status: str = Field(default="PROCESSED", description="Processing status label")
    response_text: str = Field(default="")
    content: Optional[str] = Field(default=None)
    generated_sql: Optional[str] = Field(default=None)
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    confidence_score: float = Field(default=0.0)
    sources: List[str] = Field(default_factory=list)
    analytical_summary: Optional[Dict[str, Any]] = Field(default_factory=dict)
    viz_spec: Optional[Any] = Field(default=None, description="List of Plotly chart specs or single spec")
    artifacts: Optional[Dict[str, Any]] = Field(default=None)
    suggested_followups: List[str] = Field(default_factory=list)
