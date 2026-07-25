"""FTP & REST API Downloaders for ARGO GDAC & REST provider endpoints."""
from typing import Dict, Any, Optional
from pathlib import Path
from loguru import logger
import httpx
from app.etl.config import etl_config


class FTPDownloader:
    """FTP downloader client for ARGO GDAC servers."""

    async def download_ftp_file(self, ftp_url: str, output_path: Path) -> Path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        # Mock FTP downloader simulation
        logger.info(f"FTP Download simulated for: {ftp_url} -> {output_path.name}")
        output_path.touch()
        return output_path


class RESTDownloader:
    """REST API downloader for JSON/CSV provider streams."""

    async def fetch_json(self, url: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        async with httpx.AsyncClient(timeout=etl_config.DOWNLOAD_TIMEOUT_SECONDS) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            return resp.json()
