"""Query Planner Service — parses natural language into structured query plans.
Direct port of notebook parse_nl_query() and adjust_time_to_metadata()."""
import re
from typing import Dict, Any, Optional
import pandas as pd
from loguru import logger

NAMED_REGIONS = {
    "bay of bengal": {"lat_min": 5, "lat_max": 22, "lon_min": 80, "lon_max": 95},
    "arabian sea": {"lat_min": 5, "lat_max": 25, "lon_min": 50, "lon_max": 75},
    "indian ocean": {"lat_min": -30, "lat_max": 30, "lon_min": 30, "lon_max": 110},
    "south indian ocean": {"lat_min": -30, "lat_max": 0, "lon_min": 30, "lon_max": 110},
    "north indian ocean": {"lat_min": 0, "lat_max": 30, "lon_min": 30, "lon_max": 110},
    "equatorial indian ocean": {"lat_min": -10, "lat_max": 10, "lon_min": 40, "lon_max": 100},
}

KNOWN_INTENTS = [
    "TEMPERATURE", "SALINITY", "TS_DIAGRAM", "FLOAT_LIST", "DEPTH_PROFILE",
    "COMPARISON", "SPATIAL_MAP", "TRAJECTORY", "ANOMALY", "GREETING", "GENERAL"
]


class QueryPlannerService:
    """Direct port of notebook parse_nl_query() + intent detection."""

    @classmethod
    def parse(cls, query: str) -> Dict[str, Any]:
        """Parse a natural language ocean science query into a structured plan."""
        txt = query.lower().strip()
        plan = {
            "raw": query,
            "intent": cls._detect_intent(txt),
            "variables": [],
            "depth_filter": None,
            "region": None,
            "time": None,
            "years": None,
        }

        # --- Variable detection (from notebook) ---
        if re.search(r"\btemp(erature)?\b", txt):
            plan["variables"].append("TEMP")
        if re.search(r"\bpsal\b|\bsalinity\b", txt):
            plan["variables"].append("PSAL")
        if not plan["variables"]:
            # Default to both variables for general queries
            plan["variables"] = ["TEMP", "PSAL"]

        # --- Depth parsing (from notebook) ---
        m_range = re.search(r"(\d{1,5})\s*[-–to]+\s*(\d{1,5})\s*m\b", txt)
        m_single = re.search(r"(\d{1,5})\s*m\b", txt)
        if m_range:
            d0, d1 = int(m_range.group(1)), int(m_range.group(2))
            plan["depth_filter"] = {"type": "range", "min_m": min(d0, d1), "max_m": max(d0, d1)}
        elif m_single:
            val = int(m_single.group(1))
            plan["depth_filter"] = {"type": "point", "m": val, "tol": 10}

        # --- Region detection (from notebook) ---
        for name, bbox in NAMED_REGIONS.items():
            if name in txt:
                plan["region"] = {"name": name, "bbox": bbox}
                break

        # Custom bbox parsing
        if not plan["region"]:
            m_bbox = re.search(
                r"lat(?:itude)?\s*([-\d.]+)\s*[-–to]+\s*([-\d.]+).*lon(?:gitude)?\s*([-\d.]+)\s*[-–to]+\s*([-\d.]+)",
                txt
            )
            if m_bbox:
                plan["region"] = {
                    "name": "custom",
                    "bbox": {
                        "lat_min": float(m_bbox.group(1)), "lat_max": float(m_bbox.group(2)),
                        "lon_min": float(m_bbox.group(3)), "lon_max": float(m_bbox.group(4))
                    }
                }

        # --- Time parsing (from notebook) ---
        plan["time"] = cls._parse_time(txt)

        # --- Multi-year comparison ---
        year_matches = re.findall(r"(20[12]\d)", txt)
        if len(year_matches) >= 2:
            plan["years"] = sorted(set(int(y) for y in year_matches))
            plan["intent"] = "COMPARISON"

        # Default region to Indian Ocean if none detected
        if not plan["region"] and plan["intent"] not in ("GREETING", "GENERAL"):
            plan["region"] = {"name": "indian ocean", "bbox": NAMED_REGIONS["indian ocean"]}

        logger.info(f"[QUERY-PLANNER] Intent={plan['intent']} Vars={plan['variables']} Region={plan['region']} Depth={plan['depth_filter']} Time={plan['time']}")
        return plan

    @classmethod
    def _detect_intent(cls, txt: str) -> str:
        """Detect query intent from text."""
        greetings = ["hello", "hi", "hey", "good morning", "good evening", "what can you do", "help"]
        if any(txt.strip() == g or txt.strip().startswith(g + " ") or txt.strip().startswith(g + ",") for g in greetings):
            return "GREETING"

        if any(w in txt for w in ["compare", "vs", "versus", "difference between", "trend"]):
            return "COMPARISON"
        if any(w in txt for w in ["t-s", "ts diagram", "temperature-salinity", "water mass"]):
            return "TS_DIAGRAM"
        if any(w in txt for w in ["salinity", "psal", "salt", "haline"]):
            return "SALINITY"
        if any(w in txt for w in ["temp", "heat", "warm", "cool", "thermal"]):
            return "TEMPERATURE"
        if any(w in txt for w in ["map", "spatial", "distribution", "scatter", "location"]):
            return "SPATIAL_MAP"
        if any(w in txt for w in ["depth", "profile", "vertical"]):
            return "DEPTH_PROFILE"
        if any(w in txt for w in ["float", "argo", "wmo", "platform", "trajectory"]):
            return "FLOAT_LIST"
        if any(w in txt for w in ["anomal", "unusual", "extreme"]):
            return "ANOMALY"

        return "GENERAL"

    @classmethod
    def _parse_time(cls, txt: str) -> Dict[str, str]:
        """Parse time references from text — port of notebook logic."""
        # "2022 to 2024", "2022-2024", "from 2022 to 2024"
        m_range = re.search(r"(20[12]\d)\s*[-–to]+\s*(20[12]\d)", txt)
        if m_range:
            y1, y2 = int(m_range.group(1)), int(m_range.group(2))
            return {"start": f"{min(y1,y2)}-01-01T00:00:00", "end": f"{max(y1,y2)}-12-31T23:59:59"}

        # Single year "in 2023"
        m_year = re.search(r"\b(20[12]\d)\b", txt)
        if m_year:
            yr = int(m_year.group(1))
            return {"start": f"{yr}-01-01T00:00:00", "end": f"{yr}-12-31T23:59:59"}

        # Month references "january 2023", "march 2024"
        months = {"january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
                  "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12}
        for month_name, month_num in months.items():
            m = re.search(rf"{month_name}\s*(20[12]\d)", txt)
            if m:
                yr = int(m.group(1))
                import calendar
                last_day = calendar.monthrange(yr, month_num)[1]
                return {"start": f"{yr}-{month_num:02d}-01T00:00:00", "end": f"{yr}-{month_num:02d}-{last_day}T23:59:59"}

        # Default to full dataset range
        return {"start": "2022-01-01T00:00:00", "end": "2024-12-31T23:59:59"}

    @classmethod
    def adjust_time_to_metadata(cls, plan: Dict[str, Any], meta_df: pd.DataFrame) -> Dict[str, Any]:
        """Clamp user-requested time range to what the dataset actually contains."""
        if "juld_min_est" not in meta_df.columns:
            return plan

        meta_df_local = meta_df.copy()
        meta_df_local["juld_min_dt"] = pd.to_datetime(meta_df_local["juld_min_est"], errors="coerce")
        meta_df_local["juld_max_dt"] = pd.to_datetime(meta_df_local["juld_max_est"], errors="coerce")

        dataset_start = meta_df_local["juld_min_dt"].min()
        dataset_end = meta_df_local["juld_max_dt"].max()

        if pd.isna(dataset_start) or pd.isna(dataset_end):
            return plan

        # Make naive
        if hasattr(dataset_start, 'tzinfo') and dataset_start.tzinfo is not None:
            dataset_start = dataset_start.tz_convert(None)
        if hasattr(dataset_end, 'tzinfo') and dataset_end.tzinfo is not None:
            dataset_end = dataset_end.tz_convert(None)

        user_start = pd.to_datetime(plan["time"]["start"]).tz_localize(None) if plan.get("time") else dataset_start
        user_end = pd.to_datetime(plan["time"]["end"]).tz_localize(None) if plan.get("time") else dataset_end

        # Check if completely outside dataset
        if user_start > dataset_end or user_end < dataset_start:
            plan["_out_of_range"] = True
            plan["_dataset_range"] = f"{dataset_start.strftime('%Y-%m-%d')} to {dataset_end.strftime('%Y-%m-%d')}"

        clamped_start = max(user_start, dataset_start)
        clamped_end = min(user_end, dataset_end)

        plan["time"]["start"] = clamped_start.isoformat()
        plan["time"]["end"] = clamped_end.isoformat()

        return plan


class ScientificQueryPlannerService:
    """Backward-compatible alias — delegates to QueryPlannerService."""

    INTENT_MAP = {
        "TEMPERATURE": "Temperature query",
        "SALINITY": "Salinity query",
        "COMPARISON": "Comparison",
        "FLOAT_LIST": "Float search",
        "TS_DIAGRAM": "Temperature query",
        "DEPTH_PROFILE": "Temperature query",
        "SPATIAL_MAP": "Spatial query",
        "TRAJECTORY": "Float search",
        "ANOMALY": "Temperature query",
        "GREETING": "Greeting",
        "GENERAL": "Scientific explanation",
    }

    @classmethod
    def parse_query(cls, prompt: str) -> Dict[str, Any]:
        """Parse query and return in the old format expected by IntentRouter/MockProvider."""
        plan = QueryPlannerService.parse(prompt)
        old_intent = cls.INTENT_MAP.get(plan["intent"], "Temperature query")

        # Map new plan keys to old format keys
        return {
            "raw": plan["raw"],
            "intent": old_intent,
            "query_type": plan["intent"],
            "variables": plan["variables"],
            "depth_filter": plan["depth_filter"],
            "region": plan["region"],
            "time": plan["time"],
            "years": plan.get("years"),
            "wmo_id": None,
            "_out_of_range": plan.get("_out_of_range", False),
            "_dataset_range": plan.get("_dataset_range"),
        }
