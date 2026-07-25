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
        self.tools: Dict[str, Any] = {
            "postgresql_spatial_query": PostgreSQLTool(),
            "semantic_hybrid_retrieval": RetrievalTool(),
            "knowledge_graph_search": KnowledgeGraphTool(),
            "ocean_statistics_calculator": StatisticsTool(),
            "ocean_region_geometry": OceanRegionTool(),
            "dataset_subset_export": ExportTool(),
            "plotly_visualization_generator": VisualizationTool(),
            "dataset_metadata_sidecar": MetadataTool(),
            "open_dataset_repository": DatasetTool(),
            "system_performance_benchmark": BenchmarkTool(),
        }

    def get_tool(self, name: str) -> Optional[Any]:
        return self.tools.get(name)

    def list_tools(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": t.name,
                "description": t.description,
                "permissions": t.permissions,
            }
            for t in self.tools.values()
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
