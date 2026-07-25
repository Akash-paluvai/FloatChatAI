"""Environment-driven ETL configuration."""
from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class ETLConfig(BaseSettings):
    """Configuration settings for scientific ETL pipelines."""
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Directories
    DATA_RAW_DIR: Path = Path("./data/raw")
    DATA_PROCESSED_DIR: Path = Path("./data/processed")
    DATA_PARQUET_DIR: Path = Path("./data/parquet")
    CACHE_DIR: Path = Path("./data/cache")

    # Downloader Settings
    DOWNLOAD_MAX_RETRIES: int = 3
    DOWNLOAD_BACKOFF_FACTOR: float = 1.5
    DOWNLOAD_TIMEOUT_SECONDS: int = 60
    MAX_CONCURRENT_DOWNLOADS: int = 5

    # Providers Endpoints
    ARGO_GDAC_FTP: str = "ftp://usgodae.org/pub/outgoing/argo"
    ERDDAP_BASE_URL: str = "https://coastwatch.pfeg.noaa.gov/erddap"
    ARGOVIS_BASE_URL: str = "https://argovis-api.colorado.edu/v2"
    INCOIS_BASE_URL: str = "https://incois.gov.in/argo"

    # Quality Control Thresholds
    TEMP_MIN_C: float = -2.5
    TEMP_MAX_C: float = 40.0
    SALINITY_MIN_PSU: float = 0.0
    SALINITY_MAX_PSU: float = 45.0
    DEPTH_MAX_M: float = 12000.0

    # Compression
    PARQUET_COMPRESSION: str = "snappy"


etl_config = ETLConfig()
