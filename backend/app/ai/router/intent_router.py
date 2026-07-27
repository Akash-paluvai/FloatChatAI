"""Notebook Fidelity AI Intent Router & Scientific Query Parser matching reference notebooks."""
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta


class ToolRanker:
    """ToolRanker maps intent to ranked list of scientific tools."""

    INTENT_TOOL_MAP = {
        "Spatial query": ["PostgreSQLTool", "RetrievalTool", "VisualizationTool", "MetadataTool"],
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
    """Parses natural language oceanographic prompts using notebook regex & bounding boxes."""

    REGIONS = {
        "bay of bengal": {"name": "Bay of Bengal", "bbox": {"lat_min": 5.0, "lat_max": 22.0, "lon_min": 80.0, "lon_max": 95.0}},
        "arabian sea": {"name": "Arabian Sea", "bbox": {"lat_min": 5.0, "lat_max": 25.0, "lon_min": 50.0, "lon_max": 77.0}},
        "indian ocean": {"name": "Indian Ocean", "bbox": {"lat_min": -40.0, "lat_max": 30.0, "lon_min": 20.0, "lon_max": 120.0}},
        "equatorial indian ocean": {"name": "Equatorial Indian Ocean", "bbox": {"lat_min": -10.0, "lat_max": 10.0, "lon_min": 50.0, "lon_max": 100.0}},
        "southern ocean": {"name": "Southern Ocean", "bbox": {"lat_min": -70.0, "lat_max": -40.0, "lon_min": 20.0, "lon_max": 120.0}},
    }

    VARIABLES_MAP = {
        "temperature": "TEMP", "temp": "TEMP", "sst": "TEMP",
        "salinity": "PSAL", "psal": "PSAL",
        "pressure": "PRES", "pres": "PRES",
        "oxygen": "DOXY", "doxy": "DOXY",
        "chlorophyll": "CHLA", "chla": "CHLA",
        "nitrate": "NITRATE"
    }

    @classmethod
    def parse_query(cls, prompt: str) -> Dict[str, Any]:
        p_lower = prompt.lower().strip()

        # 1. Check Greeting Intent
        if re.search(r'\b(hi|hello|hey|greetings|who are you|good morning|good afternoon)\b', p_lower):
            return {
                "raw": prompt,
                "intent": "Greeting",
                "variables": [],
                "region": None,
                "depth_filter": None,
                "time": None
            }

        # 2. Variables
        vars_found = set()
        for k, v in cls.VARIABLES_MAP.items():
            if k in p_lower:
                vars_found.add(v)
        if not vars_found:
            vars_found = {"TEMP", "PSAL"}

        # 3. Region BBox
        matched_region = None
        for r_key, r_info in cls.REGIONS.items():
            if r_key in p_lower:
                matched_region = r_info
                break

        # 4. Depth Filter
        depth_filter = None
        depth_point_match = re.search(r'(?:at|near|depth)\s*(\d+)\s*m', p_lower)
        depth_range_match = re.search(r'(\d+)\s*-\s*(\d+)\s*m', p_lower)

        if depth_point_match:
            d_val = float(depth_point_match.group(1))
            depth_filter = {"type": "point", "m": d_val, "tol": 10.0}
        elif depth_range_match:
            d_min = float(depth_range_match.group(1))
            d_max = float(depth_range_match.group(2))
            depth_filter = {"type": "range", "min_m": d_min, "max_m": d_max}

        # 5. Time Window
        now = datetime(2024, 12, 31)
        start_date = now - timedelta(days=365)
        end_date = now

        year_match = re.search(r'\b(2022|2023|2024)\b', p_lower)
        if year_match:
            yr = int(year_match.group(1))
            start_date = datetime(yr, 1, 1)
            end_date = datetime(yr, 12, 31)

        last_months_match = re.search(r'last\s*(\d+)\s*months', p_lower)
        if last_months_match:
            n_months = int(last_months_match.group(1))
            start_date = now - timedelta(days=n_months * 30)

        # 6. Determine Intent
        if "export" in p_lower or "download" in p_lower:
            intent = "Export request"
        elif "plot" in p_lower or "chart" in p_lower or "3d" in p_lower:
            intent = "Visualization request"
        elif "statistic" in p_lower or "average" in p_lower or "anomaly" in p_lower:
            intent = "Statistics"
        else:
            intent = "Spatial query" if matched_region else "Scientific explanation"

        return {
            "raw": prompt,
            "intent": intent,
            "variables": list(vars_found),
            "region": matched_region,
            "depth_filter": depth_filter,
            "time": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            }
        }

    @classmethod
    def route_intent(cls, prompt: str) -> Dict[str, Any]:
        parsed = cls.parse_query(prompt)
        return {
            "prompt": prompt,
            "intent": parsed["intent"],
            "requires_tools": parsed["intent"] not in ["Greeting"],
            "parsed_spec": parsed
        }
