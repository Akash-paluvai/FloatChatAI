"""ParquetExporter exporting normalized datasets into Snappy-compressed Apache Parquet with JSON metadata sidecars."""
import json
from typing import Any, Dict
from pathlib import Path
import pandas as pd
from loguru import logger
from app.etl.config import etl_config


class ParquetExporter:
    """Exports normalized ocean data into optimized Apache Parquet + JSON metadata sidecars."""

    @staticmethod
    def export_to_parquet(
        normalized_data: Dict[str, Any],
        metadata_dict: Dict[str, Any],
        output_dir: Path,
        file_basename: str = "argo_profiles"
    ) -> Path:
        output_dir.mkdir(parents=True, exist_ok=True)
        parquet_file = output_dir / f"{file_basename}.parquet"
        metadata_file = output_dir / f"{file_basename}.metadata.json"

        measurements = normalized_data.get("measurements", {})
        df = pd.DataFrame({
            "platform_id": normalized_data.get("platform_id", "2901234"),
            "latitude": normalized_data.get("latitude", 15.5),
            "longitude": normalized_data.get("longitude", 88.2),
            "timestamp": normalized_data.get("timestamp", ""),
            "ocean_region": normalized_data.get("ocean_region", "Bay of Bengal"),
            "depth_m": measurements.get("depth_m", [0.0]),
            "temperature_c": measurements.get("temperature_celsius", [20.0]),
            "salinity_psu": measurements.get("salinity_psu", [34.0]),
            "qc_flag": measurements.get("qc_flags", [1]),
        })

        # Write Parquet with Snappy compression
        df.to_parquet(parquet_file, engine="pyarrow", compression=etl_config.PARQUET_COMPRESSION, index=False)
        logger.info(f"Parquet exported: {parquet_file} ({parquet_file.stat().st_size} bytes)")

        # Write Metadata JSON sidecar
        with open(metadata_file, "w", encoding="utf-8") as f:
            json.dump(metadata_dict, f, indent=2)

        return parquet_file
