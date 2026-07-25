"""Test Parquet Exporter & Normalizer."""
import pytest
from pathlib import Path
from app.etl.normalizers.schema_normalizer import SchemaNormalizer
from app.etl.metadata.generator import MetadataGenerator, Partitioner
from app.etl.parquet.exporter import ParquetExporter


def test_normalizer_and_exporter(tmp_path: Path):
    raw = {
        "source": "ARGO GDAC",
        "platform_id": "2901234",
        "latitude": 15.5,
        "longitude": 88.2,
        "ocean_region": "Bay of Bengal",
        "variables": {
            "depth_m": [0.0, 50.0],
            "temp_c": [28.5, 27.2],
            "salinity_psu": [33.2, 33.8],
            "qc_flags": [1, 1],
        }
    }
    norm = SchemaNormalizer.normalize(raw)
    assert norm["is_normalized"] is True

    meta = MetadataGenerator.generate_metadata_sidecar(norm)
    assert meta["provider"] == "ARGO GDAC"

    partition_dir = Partitioner.get_partition_path(tmp_path, "argo", "bay_of_bengal", norm["timestamp"])
    parquet_path = ParquetExporter.export_to_parquet(norm, meta, partition_dir, file_basename="test_argo")
    assert parquet_path.exists()
    assert (partition_dir / "test_argo.metadata.json").exists()
