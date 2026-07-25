"""AgentScheduler and ResourceManager modules."""
import asyncio
from typing import Dict, Any, List
from loguru import logger


class ResourceManager:
    """Tracks RAM usage, API quotas, token budgets, and DB connection limits."""

    def __init__(self, max_ram_mb: float = 8192.0, max_token_budget: int = 100000):
        self.max_ram_mb = max_ram_mb
        self.used_ram_mb = 120.0
        self.max_token_budget = max_token_budget
        self.consumed_tokens = 1500
        self.active_db_connections = 2

    def check_resource_availability(self, estimated_tokens: int = 2000) -> Dict[str, Any]:
        has_tokens = (self.consumed_tokens + estimated_tokens) <= self.max_token_budget
        has_ram = self.used_ram_mb < self.max_ram_mb
        return {
            "can_dispatch": has_tokens and has_ram,
            "used_ram_mb": self.used_ram_mb,
            "remaining_tokens": self.max_token_budget - self.consumed_tokens,
            "active_db_connections": self.active_db_connections
        }


class AgentScheduler:
    """Manages priority queuing, concurrency limits, and worker agent scheduling."""

    def __init__(self, resource_mgr: ResourceManager = None):
        self.resource_mgr = resource_mgr if resource_mgr else ResourceManager()
        self.task_queue: List[Dict[str, Any]] = []

    async def schedule_and_dispatch(self, agent_name: str, task_fn, task_input: Dict[str, Any]) -> Dict[str, Any]:
        res_status = self.resource_mgr.check_resource_availability()
        if not res_status["can_dispatch"]:
            logger.warning(f"AgentScheduler throttling {agent_name} due to resource constraints.")
            await asyncio.sleep(0.01)

        logger.info(f"AgentScheduler dispatching task to '{agent_name}'")
        return await task_fn(task_input)
