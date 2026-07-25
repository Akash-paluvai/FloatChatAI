"""BaseAgent abstract contract for FloatChat multi-agent fleet."""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class AgentMetadata(BaseModel):
    name: str
    description: str
    version: str = "v1.0.0"
    capabilities: List[str] = Field(default_factory=list)
    supported_tools: List[str] = Field(default_factory=list)
    health_status: str = "HEALTHY"


class BaseAgent(ABC):
    """Abstract contract for all FloatChat worker and supervisor agents."""

    def __init__(self, name: str, description: str, capabilities: List[str], supported_tools: List[str]):
        self.metadata = AgentMetadata(
            name=name,
            description=description,
            capabilities=capabilities,
            supported_tools=supported_tools,
            health_status="HEALTHY"
        )

    @abstractmethod
    async def execute_task(self, task_input: Dict[str, Any], shared_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Executes agent-specific task logic."""
        raise NotImplementedError()

    def health_check(self) -> Dict[str, Any]:
        return {
            "name": self.metadata.name,
            "status": self.metadata.health_status,
            "capabilities": self.metadata.capabilities,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
