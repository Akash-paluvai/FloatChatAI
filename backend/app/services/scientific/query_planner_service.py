"""Scientific Query Planner Service refactored directly from reference notebooks (Step3, 03_query_examples)."""
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta


class ScientificQueryPlannerService:
    """Notebook-derived intent router, entity extractor, and bounding box planner."""

    REGIONS = {
        "equatorial indian ocean": {"name": "Equatorial Indian Ocean", "bbox": {"lat_min": -10.0, "lat_max": 10.0, "lon_min": 50.0, "lon_max": 100.0}},
        "bay of bengal": {"name": "Bay of Bengal", "bbox": {"lat_min": 5.0, "lat_max": 22.0, "lon_min": 80.0, "lon_max": 95.0}},
        "arabian sea": {"name": "Arabian Sea", "bbox": {"lat_min": 5.0, "lat_max": 25.0, "lon_min": 50.0, "lon_max": 77.0}},
        "southern ocean": {"name": "Southern Ocean", "bbox": {"lat_min": -70.0, "lat_max": -40.0, "lon_min": 20.0, "lon_max": 120.0}},
        "indian ocean": {"name": "Indian Ocean", "bbox": {"lat_min": -40.0, "lat_max": 30.0, "lon_min": 20.0, "lon_max": 120.0}},
    }

    VARIABLES_MAP = {
        "temperature": "TEMP", "temp": "TEMP", "heat": "TEMP", "sst": "TEMP", "thermal": "TEMP",
        "salinity": "PSAL", "psal": "PSAL", "halocline": "PSAL",
        "pressure": "PRES", "pres": "PRES",
        "oxygen": "DOXY", "doxy": "DOXY",
        "chlorophyll": "CHLA", "chla": "CHLA",
        "nitrate": "NITRATE"
    }

    @classmethod
    def parse_query(cls, prompt: str) -> Dict[str, Any]:
        p_lower = prompt.lower().strip()

        # 1. Greeting Check
        if re.search(r'^\s*(hi|hello|hey|greetings|who are you|good morning|good afternoon)\b', p_lower):
            return {
                "raw": prompt,
                "intent": "Greeting",
                "query_type": "GREETING",
                "variables": [],
                "region": None,
                "depth_filter": None,
                "time": None,
                "wmo_id": None
            }

        # 2. Float Search Check
        wmo_match = re.search(r'(?:float|platform|wmo)\s*#?\s*(\d{5,7})', p_lower)
        if wmo_match or "list active argo floats" in p_lower or "track float" in p_lower or "active floats" in p_lower:
            wmo_id = int(wmo_match.group(1)) if wmo_match else 2901234
            matched_region = cls._extract_region(p_lower)
            return {
                "raw": prompt,
                "intent": "Float search",
                "query_type": "FLOAT_SEARCH",
                "variables": ["TEMP", "PSAL"],
                "region": matched_region or cls.REGIONS["indian ocean"],
                "depth_filter": None,
                "time": None,
                "wmo_id": wmo_id
            }

        # 3. Comparison Check
        if re.search(r'\b(compare|versus|vs|comparison|trend|delta|difference)\b', p_lower) or re.search(r'2022\s*(?:vs|and|to|versus)\s*2024', p_lower) or re.search(r'2022\s*(?:vs|and|to|versus)\s*2023', p_lower):
            matched_region = cls._extract_region(p_lower)
            years = [int(y) for y in re.findall(r'\b(2022|2023|2024)\b', p_lower)]
            if not years:
                years = [2022, 2024]
            return {
                "raw": prompt,
                "intent": "Comparison",
                "query_type": "COMPARISON",
                "variables": cls._extract_variables(p_lower),
                "region": matched_region or cls.REGIONS["indian ocean"],
                "depth_filter": cls._extract_depth(p_lower),
                "years": sorted(list(set(years)))
            }

        # 4. Dataset / Coverage Check
        if re.search(r'\b(dataset|coverage|catalog|files|metadata|bounds)\b', p_lower):
            matched_region = cls._extract_region(p_lower)
            return {
                "raw": prompt,
                "intent": "Dataset query",
                "query_type": "DATASET",
                "variables": cls._extract_variables(p_lower),
                "region": matched_region or cls.REGIONS["bay of bengal"],
                "depth_filter": None,
                "time": None
            }

        # 5. Salinity / Halocline Check
        if "salinity" in p_lower or "psal" in p_lower or "halocline" in p_lower or "t-s" in p_lower or "water mass" in p_lower:
            matched_region = cls._extract_region(p_lower)
            return {
                "raw": prompt,
                "intent": "Salinity query",
                "query_type": "SALINITY",
                "variables": ["PSAL", "TEMP"],
                "region": matched_region or cls.REGIONS["bay of bengal"],
                "depth_filter": cls._extract_depth(p_lower),
                "time": cls._extract_time(p_lower)
            }

        # 6. Temperature / Spatial Query
        matched_region = cls._extract_region(p_lower)
        return {
            "raw": prompt,
            "intent": "Temperature query" if "temp" in p_lower or "thermocline" in p_lower else "Spatial query",
            "query_type": "TEMPERATURE",
            "variables": cls._extract_variables(p_lower),
            "region": matched_region or cls.REGIONS["bay of bengal"],
            "depth_filter": cls._extract_depth(p_lower),
            "time": cls._extract_time(p_lower)
        }

    @classmethod
    def _extract_region(cls, p_lower: str) -> Optional[Dict[str, Any]]:
        # Sort by key length descending so 'equatorial indian ocean' matches before 'indian ocean'
        for r_key in sorted(cls.REGIONS.keys(), key=len, reverse=True):
            if r_key in p_lower:
                return cls.REGIONS[r_key]
        return None

    @classmethod
    def _extract_variables(cls, p_lower: str) -> List[str]:
        vars_found = set()
        for k, v in cls.VARIABLES_MAP.items():
            if k in p_lower:
                vars_found.add(v)
        return list(vars_found) if vars_found else ["TEMP", "PSAL"]

    @classmethod
    def _extract_depth(cls, p_lower: str) -> Optional[Dict[str, Any]]:
        depth_point_match = re.search(r'(?:at|near|depth)\s*~?\s*(\d+)\s*m', p_lower)
        depth_range_match = re.search(r'(\d+)\s*-\s*(\d+)\s*m', p_lower)

        if depth_point_match:
            d_val = float(depth_point_match.group(1))
            return {"type": "point", "m": d_val, "tol": 10.0}
        elif depth_range_match:
            d_min = float(depth_range_match.group(1))
            d_max = float(depth_range_match.group(2))
            return {"type": "range", "min_m": d_min, "max_m": d_max}
        return None

    @classmethod
    def _extract_time(cls, p_lower: str) -> Dict[str, str]:
        now = datetime(2024, 12, 31)
        start_date = datetime(2023, 1, 1)
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

        return {"start": start_date.isoformat(), "end": end_date.isoformat()}
