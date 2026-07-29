"""TaskPlanner and ExecutionEngine — decouples planning from real-data execution.
Properly passes query plan to DataPipelineService and generates ALL visualizations."""
from typing import Dict, Any, List
from pydantic import BaseModel, Field
from loguru import logger
from app.ai.router.intent_router import AIIntentRouter, ToolRanker
from app.ai.mcp.registry import mcp_server
from app.services.scientific.data_pipeline_service import DataPipelineService, get_metadata_catalog
from app.services.scientific.analytics_engine import OceanAnalyticsEngine
from app.services.scientific.visualization_engine import ScientificVisualizationEngine
from app.services.scientific.query_planner_service import QueryPlannerService


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
    """ExecutionEngine invokes real-data pipeline and generates all visualizations."""

    def __init__(self, server=None):
        self.server = server if server else mcp_server

    async def execute_plan(self, plan: TaskPlanSpec, prompt: str) -> Dict[str, Any]:
        parsed = plan.parsed_spec
        query_type = parsed.get("query_type", "TEMPERATURE")
        region_info = parsed.get("region")
        region_name = region_info.get("name", "Indian Ocean") if region_info else "Indian Ocean"

        logger.info(f"[EXECUTION-ENGINE] type='{query_type}' region='{region_name}' vars={parsed.get('variables')} depth={parsed.get('depth_filter')}")

        # Build the plan dict in the format our new services expect
        data_plan = {
            "raw": parsed.get("raw", prompt),
            "variables": parsed.get("variables", ["TEMP", "PSAL"]),
            "depth_filter": parsed.get("depth_filter"),
            "region": parsed.get("region"),
            "time": parsed.get("time", {"start": "2022-01-01T00:00:00", "end": "2024-12-31T23:59:59"}),
            "years": parsed.get("years"),
        }

        # Adjust time to metadata (clamp to dataset bounds)
        meta = get_metadata_catalog()
        data_plan = QueryPlannerService.adjust_time_to_metadata(data_plan, meta)

        # Check if query is completely out of range
        if data_plan.get("_out_of_range"):
            ds_range = data_plan.get("_dataset_range", "2022–2024")
            return {
                "status": "NO_DATA",
                "intent": plan.query_intent,
                "query_type": query_type,
                "df_res": __import__("pandas").DataFrame(),
                "analytics": {
                    "summary": f"No observations available. The requested time period falls outside the dataset range ({ds_range}).",
                    "total_observations": 0,
                    "dataset_range": ds_range,
                },
                "viz_spec": [],
                "tool_results": {"notebook_dataframe_sample": {"n_rows": 0, "columns": [], "sample_rows": []}},
                "failures": [],
            }

        # Execute the real data pipeline
        if query_type == "COMPARISON":
            df_dict = DataPipelineService.load_multi_year_datasets(data_plan)
            years = data_plan.get("years", [2022, 2024])
            last_year_df = df_dict.get(years[-1], __import__("pandas").DataFrame())
            primary_var = data_plan["variables"][0] if data_plan["variables"] else "TEMP"
            analytics = OceanAnalyticsEngine.compute_multi_year_comparison(df_dict, primary_var)

            # Generate multiple visualizations
            viz_specs = [ScientificVisualizationEngine.generate_multi_year_overlay(df_dict, primary_var)]
            if not last_year_df.empty:
                viz_specs.extend(ScientificVisualizationEngine.generate_all_visualizations(last_year_df, data_plan))
            df_res = last_year_df

        elif query_type == "FLOAT_LIST" or query_type == "TRAJECTORY":
            df_res, float_meta = DataPipelineService.load_float_trajectory(region=data_plan.get("region"))
            analytics = {"float_metadata": float_meta, "observation_count": len(df_res), "total_observations": len(df_res)}
            viz_specs = [ScientificVisualizationEngine.generate_trajectory_map(df_res)]
            if not df_res.empty:
                viz_specs.extend(ScientificVisualizationEngine.generate_all_visualizations(df_res, data_plan))

        elif query_type == "SALINITY":
            df_res, info = DataPipelineService.execute_data_plan(data_plan)
            analytics = OceanAnalyticsEngine.compute_salinity_analytics(df_res, region_name)
            viz_specs = ScientificVisualizationEngine.generate_all_visualizations(df_res, data_plan)

        elif query_type == "TS_DIAGRAM":
            data_plan["variables"] = ["TEMP", "PSAL"]
            df_res, info = DataPipelineService.execute_data_plan(data_plan)
            analytics = OceanAnalyticsEngine.compute_thermocline_and_stats(df_res, region_name)
            viz_specs = ScientificVisualizationEngine.generate_all_visualizations(df_res, data_plan)

        else:
            # TEMPERATURE, DEPTH_PROFILE, SPATIAL_MAP, ANOMALY, GENERAL
            df_res, info = DataPipelineService.execute_data_plan(data_plan)
            analytics = OceanAnalyticsEngine.compute_thermocline_and_stats(df_res, region_name)
            viz_specs = ScientificVisualizationEngine.generate_all_visualizations(df_res, data_plan)

        # Build tool results (data sample for frontend)
        tool_results = {}
        if not df_res.empty:
            # Convert datetime columns for JSON serialization
            sample = df_res.head(10).copy()
            for col in sample.columns:
                if hasattr(sample[col], 'dt'):
                    sample[col] = sample[col].astype(str)
            tool_results["notebook_dataframe_sample"] = {
                "n_rows": len(df_res),
                "columns": list(df_res.columns),
                "sample_rows": sample.to_dict(orient="records")
            }
        else:
            tool_results["notebook_dataframe_sample"] = {"n_rows": 0, "columns": [], "sample_rows": []}

        logger.info(f"[EXECUTION-ENGINE] Completed: {len(df_res)} rows, {len(viz_specs)} charts, analytics keys: {list(analytics.keys())}")

        return {
            "status": "COMPLETED",
            "intent": plan.query_intent,
            "query_type": query_type,
            "df_res": df_res,
            "analytics": analytics,
            "viz_spec": viz_specs,
            "tool_results": tool_results,
            "failures": [],
        }
