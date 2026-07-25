"""Command-Line Interface for FloatChat Ocean ETL Platform."""
import asyncio
import sys
from pathlib import Path
import click
from loguru import logger

from app.etl.providers.argo.provider import ARGOProvider
from app.etl.providers.erddap.provider import ERDDAPProvider
from app.etl.providers.argovis.provider import ArgovisProvider
from app.etl.providers.incois.provider import INCOISProvider
from app.etl.base.pipeline import ETLPipeline
from app.etl.extractors.netcdf import NetCDFExtractor
from app.etl.quality_control.qc_engine import QCEngine, QCReportGenerator
from app.etl.normalizers.schema_normalizer import SchemaNormalizer
from app.etl.metadata.generator import MetadataGenerator, Partitioner
from app.etl.parquet.exporter import ParquetExporter
from app.etl.config import etl_config


@click.group()
def cli():
    """FloatChat Scientific Ocean ETL Command Line Interface."""
    pass


@cli.command()
@click.option("--provider", default="argo", help="Provider name: argo, erddap, argovis, incois")
def download(provider: str):
    """Download raw dataset from specified provider."""
    click.echo(f"Downloading raw ocean dataset from: {provider.upper()}")
    # Async execution wrapper
    async def _run():
        prov = _get_provider(provider)
        files = await prov.download(etl_config.DATA_RAW_DIR)
        click.echo(f"Downloaded {len(files)} files to {etl_config.DATA_RAW_DIR}")
    asyncio.run(_run())


@cli.command()
@click.option("--file", required=True, help="Path to file to validate")
def validate(file: str):
    """Validate file integrity & coordinates."""
    path = Path(file)
    click.echo(f"Validating dataset integrity for: {path.name}")
    extractor = NetCDFExtractor()
    raw_data = extractor.parse(path)
    prov = ARGOProvider()
    is_valid = asyncio.run(prov.validate(raw_data))
    click.echo(f"Validation Result: {'PASSED ✓' if is_valid else 'FAILED ✗'}")


@cli.command()
@click.option("--provider", default="argo", help="Provider name")
def transform(provider: str):
    """Transform and normalize dataset schema."""
    click.echo(f"Normalizing dataset schema for provider: {provider}")
    prov = _get_provider(provider)
    async def _run():
        files = await prov.download(etl_config.DATA_RAW_DIR)
        raw = await prov.extract(files[0])
        norm = SchemaNormalizer.normalize(raw)
        click.echo(f"Normalized Platform #{norm['platform_id']} in {norm['ocean_region']}")
    asyncio.run(_run())


@cli.command()
@click.option("--provider", default="argo", help="Provider name")
def metadata(provider: str):
    """Extract metadata sidecar JSON."""
    click.echo(f"Extracting metadata sidecar for provider: {provider}")
    prov = _get_provider(provider)
    async def _run():
        files = await prov.download(etl_config.DATA_RAW_DIR)
        raw = await prov.extract(files[0])
        meta = await prov.metadata(raw)
        click.echo(f"Metadata Sidecar Generated: {meta}")
    asyncio.run(_run())


@cli.command()
@click.option("--provider", default="argo", help="Provider name")
def export(provider: str):
    """Export dataset into partitioned Apache Parquet."""
    click.echo(f"Exporting Parquet dataset for provider: {provider}")
    prov = _get_provider(provider)
    async def _run():
        files = await prov.download(etl_config.DATA_RAW_DIR)
        raw = await prov.extract(files[0])
        norm = SchemaNormalizer.normalize(raw)
        meta = MetadataGenerator.generate_metadata_sidecar(norm)
        partition_dir = Partitioner.get_partition_path(
            etl_config.DATA_PARQUET_DIR, provider, norm["ocean_region"], norm["timestamp"]
        )
        p = ParquetExporter.export_to_parquet(norm, meta, partition_dir)
        click.echo(f"Parquet Exported Successfully: {p}")
    asyncio.run(_run())


@cli.command()
@click.option("--provider", default="argo", help="Provider name: argo, erddap, argovis, incois")
def run_etl(provider: str):
    """Execute end-to-end ETL pipeline for a provider."""
    click.echo(f"Executing End-to-End Scientific ETL Pipeline for: {provider.upper()}")
    async def _run():
        prov = _get_provider(provider)
        pipeline = ETLPipeline(prov)
        results = await pipeline.run_pipeline(etl_config.DATA_RAW_DIR)
        click.echo(f"Pipeline Execution Complete. Processed {len(results)} datasets.")
    asyncio.run(_run())


def _get_provider(name: str):
    name_lower = name.lower()
    if name_lower == "erddap":
        return ERDDAPProvider()
    elif name_lower == "argovis":
        return ArgovisProvider()
    elif name_lower == "incois":
        return INCOISProvider()
    return ARGOProvider()


if __name__ == "__main__":
    cli()
