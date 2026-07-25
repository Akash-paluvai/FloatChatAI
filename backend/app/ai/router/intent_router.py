"""AIIntentRouter & ToolRanker modules."""
from typing import Dict, Any, List


class AIIntentRouter:
    """Classifies user prompts into 10 structural AI intents."""

    @staticmethod
    def route_intent(prompt: str) -> Dict[str, Any]:
        p_lower = prompt.lower()

        if any(k in p_lower for k in ["greeting", "hello", "hi", "hey"]):
            intent = "Greeting"
        elif any(k in p_lower for k in ["dataset", "open dataset", "source", "incois", "erddap"]):
            intent = "Dataset lookup"
        elif any(k in p_lower for k in ["export", "download csv", "parquet", "geojson"]):
            intent = "Export request"
        elif any(k in p_lower for k in ["plot", "graph", "chart", "visualize", "contour", "3d"]):
            intent = "Visualization request"
        elif any(k in p_lower for k in ["statistic", "average", "mean", "sst", "anomaly", "climatology"]):
            intent = "Statistics"
        elif any(k in p_lower for k in ["compare", "versus", "difference", "baseline"]):
            intent = "Comparison"
        elif any(k in p_lower for k in ["where", "region", "bay of bengal", "arabian sea", "lat", "lon", "near"]):
            intent = "Spatial query"
        elif any(k in p_lower for k in ["when", "date", "2022", "2023", "2024", "year", "month"]):
            intent = "Temporal query"
        else:
            intent = "Scientific explanation"

        return {
            "prompt": prompt,
            "intent": intent,
            "requires_tools": intent not in ["Greeting"],
        }


class ToolRanker:
    """Ranks candidate MCP tools based on query intent."""

    @staticmethod
    def rank_tools(intent: str) -> List[str]:
        if intent in ["Spatial query", "Scientific explanation"]:
            return ["semantic_hybrid_retrieval", "postgresql_spatial_query", "knowledge_graph_search"]
        elif intent == "Statistics":
            return ["ocean_statistics_calculator", "semantic_hybrid_retrieval"]
        elif intent == "Visualization request":
            return ["plotly_visualization_generator", "semantic_hybrid_retrieval"]
        elif intent == "Export request":
            return ["dataset_subset_export", "postgresql_spatial_query"]
        elif intent == "Dataset lookup":
            return ["open_dataset_repository", "dataset_metadata_sidecar"]
        return ["semantic_hybrid_retrieval"]
