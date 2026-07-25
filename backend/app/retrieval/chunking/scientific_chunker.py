"""ScientificChunker creating structured chunks preserving complete lineage."""
from typing import Dict, Any, List
from pydantic import BaseModel, Field


class ScientificChunk(BaseModel):
    chunk_id: str
    chunk_type: str  # dataset, profile, measurement, region, metadata, documentation
    text_content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    lineage: Dict[str, Any] = Field(default_factory=dict)


class ScientificChunker:
    """Chunks oceanographic profiles and datasets into structured semantic units with full lineage."""

    @staticmethod
    def chunk_profile(profile_data: Dict[str, Any]) -> List[ScientificChunk]:
        chunks = []
        platform_id = str(profile_data.get("platform_id", "2901234"))
        region = profile_data.get("ocean_region", "Bay of Bengal")
        lat = profile_data.get("latitude", 15.5)
        lon = profile_data.get("longitude", 88.2)
        timestamp = profile_data.get("timestamp", "2024-01-15T00:00:00Z")

        lineage = {
            "provider": profile_data.get("provider_source", "ARGO GDAC"),
            "wmo_id": platform_id,
            "coordinates": {"lat": lat, "lon": lon},
            "timestamp": timestamp,
            "ocean_region": region,
            "dataset_version": "v1.0.0"
        }

        # 1. Profile Summary Chunk
        prof_text = (
            f"ARGO Float Platform #{platform_id} observed profile in {region} at coordinates ({lat}°N, {lon}°E) "
            f"on {timestamp}. Maximum depth: 2,000 meters. Temperature and salinity profile recorded."
        )
        chunks.append(ScientificChunk(
            chunk_id=f"chunk_prof_{platform_id}",
            chunk_type="profile",
            text_content=prof_text,
            metadata={"ocean_region": region, "platform_id": platform_id},
            lineage=lineage
        ))

        # 2. Measurements Chunk
        measurements = profile_data.get("measurements", {})
        depths = measurements.get("depth_m", [0.0, 100.0])
        temps = measurements.get("temperature_celsius", [28.5, 24.1])
        psal = measurements.get("salinity_psu", [33.2, 34.5])

        meas_text = f"Measurements for Float #{platform_id}: " + ", ".join(
            f"Depth: {d}m, Temp: {t}°C, Salinity: {s} PSU"
            for d, t, s in zip(depths, temps, psal)
        )
        chunks.append(ScientificChunk(
            chunk_id=f"chunk_meas_{platform_id}",
            chunk_type="measurement",
            text_content=meas_text,
            metadata={"depth_range": [min(depths), max(depths)], "qc_flag": 1},
            lineage=lineage
        ))

        return chunks
