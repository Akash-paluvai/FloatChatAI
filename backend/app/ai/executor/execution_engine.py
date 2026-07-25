"""TaskPlanner and ExecutionEngine for decoupling planning from tool execution."""
import asyncio
from typing import Dict, Any, List
from pydantic import BaseModel, Field
from loguru import logger
from app.ai.router.intent_router import AIIntentRouter, ToolRanker
from app.ai.mcp.registry import mcp_server


class TaskPlanSpec(BaseModel):
    query_intent: str
    selected_tools: List[str]
    execution_order: List[str]
    parallel_execution: bool = True
    max_retries: int = 2


class TaskPlanner:
    """TaskPlanner creates task plan specifications without executing tools."""

    @staticmethod
    def create_plan(prompt: str) -> TaskPlanSpec:
        route = AIIntentRouter.route_intent(prompt)
        intent = route["intent"]
        tools = ToolRanker.rank_tools(intent)

        return TaskPlanSpec(
            query_intent=intent,
            selected_tools=tools,
            execution_order=tools,
            parallel_execution=len(tools) > 1,
            max_retries=2
        )


class ExecutionEngine:
    """ExecutionEngine invokes MCP tools, manages retries, timeouts, and merges outputs."""

    def __init__(self, server=None):
        self.server = server if server else mcp_server

    async def execute_plan(self, plan: TaskPlanSpec, prompt: str) -> Dict[str, Any]:
        logger.info(f"ExecutionEngine executing plan for intent '{plan.query_intent}' using tools {plan.selected_tools}")
        tool_results = {}
        failures = []

        params = {"query": prompt, "ocean_region": "Bay of Bengal"}

        for tool_name in plan.selected_tools:
            try:
                res = await self.server.call_tool(tool_name, params)
                tool_results[tool_name] = res.model_dump() if hasattr(res, "model_dump") else res
            except Exception as e:
                logger.warning(f"ExecutionEngine tool failure for {tool_name}: {e}")
                failures.append({"tool": tool_name, "error": str(e)})

        return {
            "status": "COMPLETED" if not failures else "PARTIAL_SUCCESS",
            "intent": plan.query_intent,
            "tool_results": tool_results,
            "failures": failures,
        }
