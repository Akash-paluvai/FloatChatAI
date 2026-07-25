"""AgentFeedbackEngine and SupervisorAgent modules."""
from typing import Dict, Any, List
from loguru import logger
from app.agents.base_agent import BaseAgent
from app.agents.registry.agent_registry import AgentRegistry
from app.agents.scheduler.agent_scheduler import AgentScheduler
from app.agents.workflow.workflow_dag import WorkflowDAG, DAGNode, HumanInTheLoopManager


class AgentFeedbackEngine:
    """Logs execution history, latency, success rate, and user feedback to optimize future plans."""

    def __init__(self):
        self.history: List[Dict[str, Any]] = []

    def record_execution(self, plan_id: str, success: bool, latency_ms: float) -> None:
        self.history.append({"plan_id": plan_id, "success": success, "latency_ms": latency_ms})
        logger.info(f"AgentFeedbackEngine logged plan {plan_id} (Success: {success}, Latency: {latency_ms:.2f}ms)")


class SupervisorAgent(BaseAgent):
    """SupervisorAgent decomposing complex user tasks and orchestrating worker agents via WorkflowDAG."""

    def __init__(self, registry: AgentRegistry = None, scheduler: AgentScheduler = None):
        super().__init__(
            name="SupervisorAgent",
            description="Decomposes user requests, ranks capabilities, schedules worker execution, and fuses multimodal results.",
            capabilities=["task_decomposition", "worker_orchestration", "result_fusion"],
            supported_tools=[]
        )
        self.registry = registry if registry else AgentRegistry()
        self.scheduler = scheduler if scheduler else AgentScheduler()

    async def execute_task(self, task_input: Dict[str, Any], shared_context: Dict[str, Any] = None) -> Dict[str, Any]:
        prompt = task_input.get("prompt", "Bay of Bengal temperature profile")
        logger.info(f"SupervisorAgent orchestrating multi-agent workflow for: '{prompt}'")

        # 1. Human In The Loop Check
        if HumanInTheLoopManager.requires_approval("General", task_input):
            return {"status": "APPROVAL_REQUIRED", "message": "High-resource operation requires user confirmation."}

        # 2. Build DAG
        dag = WorkflowDAG()
        dag.add_node(DAGNode(node_id="retrieval_step", agent_name="RetrievalAgent", task_input={"query": prompt}))
        dag.add_node(DAGNode(node_id="database_step", agent_name="DatabaseAgent", task_input={"ocean_region": "Bay of Bengal"}))
        dag.add_node(DAGNode(node_id="stats_step", agent_name="StatisticsAgent", task_input={"ocean_region": "Bay of Bengal"}, dependencies=["database_step"]))
        dag.add_node(DAGNode(node_id="viz_step", agent_name="VisualizationAgent", task_input={"viz_type": "temperature_profile"}, dependencies=["database_step"]))
        dag.add_node(DAGNode(node_id="validation_step", agent_name="ValidationAgent", task_input={}, dependencies=["retrieval_step", "stats_step"]))
        dag.add_node(DAGNode(node_id="response_step", agent_name="ResponseAgent", task_input={}, dependencies=["validation_step", "viz_step"]))

        # 3. Execute DAG
        dag_res = await dag.execute_dag(self.registry, self.scheduler)

        return {
            "status": "SUCCESS",
            "supervisor": self.metadata.name,
            "completed_agents": list(dag_res["node_results"].keys()),
            "results": dag_res["node_results"]
        }
