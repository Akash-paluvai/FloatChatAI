"""Notebook Fidelity AI Intent Router delegating parsing to ScientificQueryPlannerService."""
from typing import Dict, Any, List
from app.services.scientific.query_planner_service import ScientificQueryPlannerService


class ToolRanker:
    """ToolRanker maps intent to ranked list of scientific tools."""

    INTENT_TOOL_MAP = {
        "Spatial query": ["PostgreSQLTool", "RetrievalTool", "VisualizationTool", "MetadataTool"],
        "Temperature query": ["PostgreSQLTool", "RetrievalTool", "VisualizationTool", "StatisticsTool"],
        "Salinity query": ["PostgreSQLTool", "RetrievalTool", "VisualizationTool", "StatisticsTool"],
        "Comparison": ["StatisticsTool", "PostgreSQLTool", "VisualizationTool", "MetadataTool"],
        "Float search": ["PostgreSQLTool", "VisualizationTool", "MetadataTool"],
        "Dataset query": ["MetadataTool", "DatasetTool", "VisualizationTool"],
        "Statistics": ["StatisticsTool", "PostgreSQLTool", "VisualizationTool", "MetadataTool"],
        "Visualization request": ["VisualizationTool", "PostgreSQLTool", "MetadataTool"],
        "Export request": ["ExportTool", "PostgreSQLTool", "MetadataTool"],
        "Scientific explanation": ["RetrievalTool", "KnowledgeGraphTool", "PostgreSQLTool", "MetadataTool"],
        "Greeting": ["MetadataTool"]
    }

    @classmethod
    def rank_tools(cls, intent: str) -> List[str]:
        return cls.INTENT_TOOL_MAP.get(intent, ["PostgreSQLTool", "RetrievalTool", "MetadataTool"])


class AIIntentRouter:
    """Delegates query parsing to ScientificQueryPlannerService."""

    @classmethod
    def parse_query(cls, prompt: str) -> Dict[str, Any]:
        return ScientificQueryPlannerService.parse_query(prompt)

    @classmethod
    def route_intent(cls, prompt: str) -> Dict[str, Any]:
        parsed = cls.parse_query(prompt)
        return {
            "prompt": prompt,
            "intent": parsed["intent"],
            "requires_tools": parsed["intent"] not in ["Greeting"],
            "parsed_spec": parsed
        }
