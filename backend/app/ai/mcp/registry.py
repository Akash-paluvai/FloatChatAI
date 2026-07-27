"""Model Context Protocol (MCP) ToolRegistry and MCPServer."""
from typing import Dict, Any, List, Optional
from loguru import logger
from app.ai.tools.scientific_tools import (
    PostgreSQLTool,
    RetrievalTool,
    KnowledgeGraphTool,
    StatisticsTool,
    OceanRegionTool,
    ExportTool,
    VisualizationTool,
    MetadataTool,
    DatasetTool,
    BenchmarkTool,
)


class ToolRegistry:
    """Central MCP Tool Registry managing 10 scientific tools."""

    def __init__(self):
        pg_tool = PostgreSQLTool()
        ret_tool = RetrievalTool()
        kg_tool = KnowledgeGraphTool()
        stat_tool = StatisticsTool()
        reg_tool = OceanRegionTool()
        exp_tool = ExportTool()
        viz_tool = VisualizationTool()
        meta_tool = MetadataTool()
        ds_tool = DatasetTool()
        bm_tool = BenchmarkTool()

        self.tools: Dict[str, Any] = {
            "postgresql_spatial_query": pg_tool,
            "PostgreSQLTool": pg_tool,

            "semantic_hybrid_retrieval": ret_tool,
            "RetrievalTool": ret_tool,

            "knowledge_graph_search": kg_tool,
            "KnowledgeGraphTool": kg_tool,

            "ocean_statistics_calculator": stat_tool,
            "StatisticsTool": stat_tool,

            "ocean_region_geometry": reg_tool,
            "OceanRegionTool": reg_tool,

            "dataset_subset_export": exp_tool,
            "ExportTool": exp_tool,

            "plotly_visualization_generator": viz_tool,
            "VisualizationTool": viz_tool,

            "dataset_metadata_sidecar": meta_tool,
            "MetadataTool": meta_tool,

            "open_dataset_repository": ds_tool,
            "DatasetTool": ds_tool,

            "system_performance_benchmark": bm_tool,
            "BenchmarkTool": bm_tool,
        }

    def get_tool(self, name: str) -> Optional[Any]:
        return self.tools.get(name)

    def list_tools(self) -> List[Dict[str, Any]]:
        unique_tools = {}
        for t in self.tools.values():
            unique_tools[t.name] = t
        return [
            {
                "name": t.name,
                "description": t.description,
                "permissions": t.permissions,
            }
            for t in unique_tools.values()
        ]


class MCPServer:
    """MCP Protocol Server exposing tools for agent execution."""

    def __init__(self, registry: Optional[ToolRegistry] = None):
        self.registry = registry if registry else ToolRegistry()

    async def call_tool(self, name: str, params: Dict[str, Any]) -> Any:
        tool = self.registry.get_tool(name)
        if not tool:
            raise ValueError(f"MCP Tool '{name}' not found in ToolRegistry.")
        logger.info(f"MCPServer invoking tool: {name}")
        return await tool.execute(params)


mcp_server = MCPServer()
