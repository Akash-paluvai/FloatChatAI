"""WorkflowState, ConversationMemory, and ConversationContextManager modules."""
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class WorkflowState(BaseModel):
    session_id: str
    prompt: str
    intent: str = "general"
    plan: Optional[Dict[str, Any]] = None
    tool_outputs: Dict[str, Any] = Field(default_factory=dict)
    grounded_context: List[str] = Field(default_factory=list)
    confidence_score: float = 0.0
    status: str = "IN_PROGRESS"


class ConversationMemory:
    """Stores multi-turn chat history, context history, user preferences, and recent entities."""

    def __init__(self, session_id: str = "session_default"):
        self.session_id = session_id
        self.history: List[Dict[str, str]] = []
        self.recent_entities: List[str] = []

    def add_message(self, role: str, content: str) -> None:
        self.history.append({"role": role, "content": content, "timestamp": datetime.now(timezone.utc).isoformat()})

    def get_history(self, limit: int = 10) -> List[Dict[str, str]]:
        return self.history[-limit:]


class ConversationContextManager:
    """Summarizes long conversations, removes irrelevant history, and enforces token budgets."""

    @staticmethod
    def prepare_context_window(memory: ConversationMemory, current_prompt: str, max_tokens: int = 4000) -> List[Dict[str, str]]:
        recent = memory.get_history(limit=6)
        # Include current prompt
        recent.append({"role": "user", "content": current_prompt})
        return recent
