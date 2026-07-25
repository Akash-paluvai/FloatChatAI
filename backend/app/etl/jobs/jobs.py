"""Reusable ETL Job tasks plugging into WorkerScheduler."""
from typing import Dict, Any
from pathlib import Path
from app.etl.providers.argo.provider import ARGOProvider
from app.etl.base.pipeline import ETLPipeline
from app.etl.normalizers.schema_normalizer import SchemaNormalizer
from app.etl.metadata.generator import MetadataGenerator, Partitioner
from app.etl.parquet.exporter import ParquetExporter
from app.etl.config import etl_config


class DownloadJob:
    async def run(self, provider_name: str = "argo") -> Dict[str, Any]:
        provider = ARGOProvider()
        files = await provider.download(etl_config.DATA_RAW_DIR)
        return {"job": "DownloadJob", "files_count": len(files), "status": "completed"}


class ValidationJob:
    async def run(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        provider = ARGOProvider()
        valid = await provider.validate(raw_data)
        return {"job": "ValidationJob", "is_valid": valid, "status": "completed"}


class NormalizationJob:
    async def run(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        normalized = SchemaNormalizer.normalize(raw_data)
        return {"job": "NormalizationJob", "normalized": normalized, "status": "completed"}


class MetadataJob:
    async def run(self, normalized_data: Dict[str, Any]) -> Dict[str, Any]:
        meta = MetadataGenerator.generate_metadata_sidecar(normalized_data)
        return {"job": "MetadataJob", "metadata": meta, "status": "completed"}


class ExportJob:
    async def run(self, normalized_data: Dict[str, Any], metadata_dict: Dict[str, Any]) -> Dict[str, Any]:
        partition_dir = Partitioner.get_partition_path(
            etl_config.DATA_PARQUET_DIR,
            normalized_data.get("provider_source", "argo"),
            normalized_data.get("ocean_region", "bay_of_bengal"),
            normalized_data.get("timestamp", "")
        )
        parquet_path = ParquetExporter.export_to_parquet(normalized_data, metadata_dict, partition_dir)
        return {"job": "ExportJob", "parquet_path": str(parquet_path), "status": "completed"}
