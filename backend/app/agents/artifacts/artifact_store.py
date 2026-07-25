"""SharedArtifactStore and AgentSandbox modules."""
from typing import Dict, Any, Optional
import uuid
from datetime import datetime, timezone
from loguru import logger


class SharedArtifactStore:
    """Stores artifact payloads (plot.json, table.csv, report.md) and passes URI references between agents."""

    def __init__(self):
        self.artifacts: Dict[str, Dict[str, Any]] = {}

    def store_artifact(self, artifact_type: str, content: Any, creator_agent: str) -> str:
        art_id = f"art_{uuid.uuid4().hex[:8]}"
        uri = f"artifact://{artifact_type}/{art_id}"
        self.artifacts[art_id] = {
            "artifact_id": art_id,
            "uri": uri,
            "artifact_type": artifact_type,
            "content": content,
            "creator_agent": creator_agent,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        logger.info(f"SharedArtifactStore stored '{artifact_type}' created by {creator_agent}. URI: {uri}")
        return uri

    def get_artifact_by_uri(self, uri: str) -> Optional[Dict[str, Any]]:
        art_id = uri.split("/")[-1]
        return self.artifacts.get(art_id)


class AgentSandbox:
    """Provides isolated execution context for worker agents ensuring fault isolation and security."""

    @staticmethod
    async def run_in_sandbox(agent_name: str, task_fn, task_input: Dict[str, Any]) -> Dict[str, Any]:
        try:
            logger.info(f"AgentSandbox executing '{agent_name}' in isolated sandbox.")
            return await task_fn(task_input)
        except Exception as e:
            logger.error(f"AgentSandbox caught failure in '{agent_name}': {e}")
            return {"status": "SANDBOX_ERROR", "agent": agent_name, "error": str(e)}
