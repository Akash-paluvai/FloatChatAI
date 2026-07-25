"""CapabilityRegistry and AgentRegistry modules."""
from typing import Dict, Any, List, Optional
from loguru import logger
from app.agents.base_agent import BaseAgent


class CapabilityRegistry:
    """Capability Marketplace mapping granular capabilities to registered agents."""

    def __init__(self):
        self.capability_map: Dict[str, List[str]] = {}

    def register_capability(self, capability: str, agent_name: str) -> None:
        if capability not in self.capability_map:
            self.capability_map[capability] = []
        if agent_name not in self.capability_map[capability]:
            self.capability_map[capability].append(agent_name)

    def find_agents_for_capability(self, capability: str) -> List[str]:
        return self.capability_map.get(capability, [])


class AgentRegistry:
    """Central Agent Registry for registration, discovery, health monitoring, and routing."""

    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self.capability_registry = CapabilityRegistry()

    def register_agent(self, agent: BaseAgent) -> None:
        self.agents[agent.metadata.name] = agent
        for cap in agent.metadata.capabilities:
            self.capability_registry.register_capability(cap, agent.metadata.name)
        logger.info(f"AgentRegistry registered agent '{agent.metadata.name}' with {len(agent.metadata.capabilities)} capabilities.")

    def get_agent(self, name: str) -> Optional[BaseAgent]:
        return self.agents.get(name)

    def find_agents_by_capability(self, capability: str) -> List[BaseAgent]:
        names = self.capability_registry.find_agents_for_capability(capability)
        return [self.agents[n] for n in names if n in self.agents]

    def list_agents(self) -> List[Dict[str, Any]]:
        return [agent.health_check() for agent in self.agents.values()]


agent_registry = AgentRegistry()
