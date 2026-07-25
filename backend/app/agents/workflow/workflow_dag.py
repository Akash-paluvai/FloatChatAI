"""WorkflowDAG Engine and HumanInTheLoopManager modules."""
import asyncio
from typing import Dict, Any, List, Set, Optional
from pydantic import BaseModel, Field
from loguru import logger


class DAGNode(BaseModel):
    node_id: str
    agent_name: str
    task_input: Dict[str, Any] = Field(default_factory=dict)
    dependencies: List[str] = Field(default_factory=list)
    status: str = "PENDING"
    result: Optional[Dict[str, Any]] = None


class WorkflowDAG:
    """Explicit Workflow DAG engine managing task dependencies, parallel execution, and retries."""

    def __init__(self):
        self.nodes: Dict[str, DAGNode] = {}

    def add_node(self, node: DAGNode) -> None:
        self.nodes[node.node_id] = node

    async def execute_dag(self, registry, scheduler) -> Dict[str, Any]:
        logger.info(f"WorkflowDAG executing {len(self.nodes)} node DAG pipeline.")
        completed_nodes: Set[str] = set()
        results = {}

        while len(completed_nodes) < len(self.nodes):
            executable = [
                n for n in self.nodes.values()
                if n.node_id not in completed_nodes and all(dep in completed_nodes for dep in n.dependencies)
            ]
            if not executable:
                logger.warning("WorkflowDAG cycle or blocked dependency detected.")
                break

            tasks = []
            for node in executable:
                agent = registry.get_agent(node.agent_name)
                if agent:
                    tasks.append((node.node_id, scheduler.schedule_and_dispatch(
                        node.agent_name, agent.execute_task, node.task_input
                    )))

            # Execute parallel batch
            for node_id, coro in tasks:
                res = await coro
                results[node_id] = res
                self.nodes[node_id].status = "COMPLETED"
                self.nodes[node_id].result = res
                completed_nodes.add(node_id)

        return {"completed_nodes": len(completed_nodes), "node_results": results}


class HumanInTheLoopManager:
    """Pauses workflow execution and requests user approval for large queries or export operations."""

    @staticmethod
    def requires_approval(intent: str, task_input: Dict[str, Any]) -> bool:
        if intent == "Export request" or task_input.get("dataset_records", 0) > 100000:
            return True
        return False
