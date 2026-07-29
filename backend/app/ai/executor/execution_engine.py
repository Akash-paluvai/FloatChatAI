"""TaskPlanner and ExecutionEngine for decoupling planning from notebook-derived service execution."""
import asyncio
from typing import Dict, Any, List
from pydantic import BaseModel, Field
from loguru import logger
from app.ai.router.intent_router import AIIntentRouter, ToolRanker
from app.ai.mcp.registry import mcp_server
from app.services.scientific.data_pipeline_service import DataPipelineService
from app.services.scientific.analytics_engine import OceanAnalyticsEngine
from app.services.scientific.visualization_engine import ScientificVisualizationEngine


class TaskPlanSpec(BaseModel):
    query_intent: str
    selected_tools: List[str]
    execution_order: List[str]
    parallel_execution: bool = True
    max_retries: int = 2
    parsed_spec: Dict[str, Any] = Field(default_factory=dict)


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
            max_retries=2,
            parsed_spec=route["parsed_spec"]
        )


class ExecutionEngine:
    """ExecutionEngine invokes notebook-derived data & analytics services and MCP tools."""

    def __init__(self, server=None):
        self.server = server if server else mcp_server

    async def execute_plan(self, plan: TaskPlanSpec, prompt: str) -> Dict[str, Any]:
        parsed = plan.parsed_spec
        query_type = parsed.get("query_type", "TEMPERATURE")
        region_info = parsed.get("region")
        region_name = region_info.get("name", "Bay of Bengal") if region_info else "Bay of Bengal"

        logger.info(f"[PIPELINE-INSTRUMENTATION] Executing plan for query_type='{query_type}' in region='{region_name}'")

        # 1. Execute Data Pipeline Path
        if query_type == "COMPARISON":
            df_dict = DataPipelineService.load_multi_year_datasets(parsed)
            df_res = df_dict[parsed.get("years", [2022, 2024])[-1]]
            analytics = OceanAnalyticsEngine.compute_multi_year_comparison(df_dict, parsed.get("variables", ["TEMP"])[0])
            viz_spec = ScientificVisualizationEngine.generate_multi_year_overlay(df_dict, parsed.get("variables", ["TEMP"])[0])
        elif query_type == "FLOAT_SEARCH":
            df_res, float_meta = DataPipelineService.load_float_trajectory(parsed.get("wmo_id", 2901234))
            analytics = {"float_metadata": float_meta, "observation_count": len(df_res)}
            viz_spec = ScientificVisualizationEngine.generate_trajectory_map(df_res, parsed.get("wmo_id", 2901234))
        elif query_type == "SALINITY":
            df_res, _ = DataPipelineService.execute_data_plan(parsed)
            analytics = OceanAnalyticsEngine.compute_salinity_analytics(df_res, region_name)
            viz_spec = ScientificVisualizationEngine.generate_ts_diagram(df_res)
        else:
            df_res, _ = DataPipelineService.execute_data_plan(parsed)
            analytics = OceanAnalyticsEngine.compute_thermocline_and_stats(df_res, region_name)
            viz_spec = ScientificVisualizationEngine.generate_depth_profile(df_res, parsed.get("variables", ["TEMP"])[0], f"- {region_name}")

        # 2. Invoke MCP Tools for compatibility
        tool_results = {}
        failures = []
        params = {"query": prompt, "ocean_region": region_name}

        for tool_name in plan.selected_tools:
            try:
                res = await self.server.call_tool(tool_name, params)
                tool_results[tool_name] = res.model_dump() if hasattr(res, "model_dump") else res
            except Exception as e:
                failures.append({"tool": tool_name, "error": str(e)})

        tool_results["notebook_dataframe_sample"] = {
            "n_rows": len(df_res),
            "columns": list(df_res.columns),
            "sample_rows": df_res.head(5).to_dict(orient="records")
        }

        return {
            "status": "COMPLETED",
            "intent": plan.query_intent,
            "query_type": query_type,
            "df_res": df_res,
            "analytics": analytics,
            "viz_spec": viz_spec,
            "tool_results": tool_results,
            "failures": failures,
        }
