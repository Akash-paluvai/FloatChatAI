"""QueryIntentClassifier categorizing prompts before retrieval."""
from typing import Dict, Any, List


class QueryIntentClassifier:
    """Classifies user queries into structural retrieval intents."""

    INTENT_KEYWORDS = {
        "spatial": ["near", "latitude", "longitude", "region", "bay of bengal", "arabian sea", "indian ocean", "radius", "box", "eez"],
        "temporal": ["between", "date", "year", "2022", "2023", "2024", "month", "season", "daily", "trend"],
        "variable": ["temperature", "salinity", "depth", "pressure", "oxygen", "chlorophyll", "nitrate", "psu", "celsius"],
        "statistics": ["average", "mean", "min", "max", "anomaly", "count", "summary", "stdev"],
        "dataset_lookup": ["dataset", "argo", "erddap", "incois", "argovis", "gdac", "file", "download"],
    }

    @classmethod
    def classify_intent(cls, query_text: str) -> Dict[str, Any]:
        text_lower = query_text.lower()
        matched_intents: List[str] = []

        for intent, keywords in cls.INTENT_KEYWORDS.items():
            if any(k in text_lower for k in keywords):
                matched_intents.append(intent)

        primary_intent = matched_intents[0] if matched_intents else "general_semantic"

        return {
            "query_text": query_text,
            "primary_intent": primary_intent,
            "all_intents": matched_intents if matched_intents else ["general_semantic"],
            "requires_spatial_filter": "spatial" in matched_intents,
            "requires_temporal_filter": "temporal" in matched_intents,
        }
