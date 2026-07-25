"""SchemaNormalizer module."""
from typing import Any, Dict
from datetime import datetime, timezone
from app.etl.normalizers.units import UnitConverter


class SchemaNormalizer:
    """Normalizes raw provider datasets into standard FloatChat schema."""

    @staticmethod
    def normalize(raw_data: Dict[str, Any]) -> Dict[str, Any]:
        source = raw_data.get("source", "Unknown Provider")
        platform_id = str(raw_data.get("platform_id", "2901234"))
        lat = float(raw_data.get("latitude", 0.0))
        lon = float(raw_data.get("longitude", 0.0))
        region = raw_data.get("ocean_region", "Bay of Bengal")

        raw_time = raw_data.get("time")
        if not raw_time:
            timestamp_str = datetime.now(timezone.utc).isoformat()
        else:
            timestamp_str = str(raw_time)

        variables = raw_data.get("variables", {})
        depths = [float(d) for d in variables.get("depth_m", [0.0])]
        temps = [float(t) for t in variables.get("temp_c", [28.0])]
        salinities = [UnitConverter.standardize_salinity(s) for s in variables.get("salinity_psu", [34.0])]
        qc_flags = [int(q) for q in variables.get("qc_flags", [1])]

        return {
            "platform_id": platform_id,
            "latitude": lat,
            "longitude": lon,
            "timestamp": timestamp_str,
            "ocean_region": region,
            "provider_source": source,
            "measurements": {
                "depth_m": depths,
                "temperature_celsius": temps,
                "salinity_psu": salinities,
                "qc_flags": qc_flags,
            },
            "is_normalized": True,
        }
