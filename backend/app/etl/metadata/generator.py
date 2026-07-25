"""MetadataGenerator and Partitioner implementation."""
from typing import Any, Dict, List
from pathlib import Path
from datetime import datetime, timezone


class MetadataGenerator:
    """Generates dataset metadata sidecars."""

    @staticmethod
    def generate_metadata_sidecar(normalized_data: Dict[str, Any]) -> Dict[str, Any]:
        measurements = normalized_data.get("measurements", {})
        depths = measurements.get("depth_m", [0.0])
        temps = measurements.get("temperature_celsius", [20.0])
        salinities = measurements.get("salinity_psu", [34.0])

        return {
            "schema_version": "v1.0.0",
            "provider": normalized_data.get("provider_source", "ARGO"),
            "platform_id": normalized_data.get("platform_id", "2901234"),
            "ocean_region": normalized_data.get("ocean_region", "Bay of Bengal"),
            "coordinates": {
                "latitude": normalized_data.get("latitude", 15.5),
                "longitude": normalized_data.get("longitude", 88.2),
            },
            "timestamp_iso": normalized_data.get("timestamp", datetime.now(timezone.utc).isoformat()),
            "metrics_summary": {
                "profile_count": 1,
                "measurements_count": len(depths),
                "depth_range_m": [min(depths), max(depths)],
                "temp_range_c": [min(temps), max(temps)],
                "salinity_range_psu": [min(salinities), max(salinities)],
            },
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }


class Partitioner:
    """Partitions dataset folder paths by Year/Month/OceanBasin/Provider."""

    @staticmethod
    def get_partition_path(base_dir: Path, provider: str, region: str, timestamp_iso: str) -> Path:
        try:
            dt = datetime.fromisoformat(timestamp_iso.replace("Z", "+00:00"))
            year = dt.strftime("%Y")
            month = dt.strftime("%m")
        except Exception:
            year = "2024"
            month = "01"

        clean_provider = provider.lower().replace(" ", "_")
        clean_region = region.lower().replace(" ", "_")

        return base_dir / f"year={year}" / f"month={month}" / f"basin={clean_region}" / f"provider={clean_provider}"
