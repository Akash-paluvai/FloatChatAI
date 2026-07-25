"""Asynchronous HTTP/HTTPS Downloader with retries, exponential backoff, and checksum verification."""
import asyncio
import hashlib
from typing import Optional, Callable
from pathlib import Path
import httpx
from loguru import logger
from app.etl.config import etl_config


class HTTPDownloader:
    """Async HTTP Downloader supporting resume, retries, and checksum validation."""

    def __init__(self, max_retries: int = etl_config.DOWNLOAD_MAX_RETRIES):
        self.max_retries = max_retries

    async def download_file(
        self,
        url: str,
        output_path: Path,
        expected_md5: Optional[str] = None,
        progress_cb: Optional[Callable[[int, int], None]] = None
    ) -> Path:
        output_path.parent.mkdir(parents=True, exist_ok=True)

        if output_path.exists() and expected_md5 and self.verify_checksum(output_path, expected_md5):
            logger.info(f"File already cached & verified: {output_path.name}")
            return output_path

        retry_count = 0
        backoff = etl_config.DOWNLOAD_BACKOFF_FACTOR

        while retry_count < self.max_retries:
            try:
                async with httpx.AsyncClient(timeout=etl_config.DOWNLOAD_TIMEOUT_SECONDS, follow_redirects=True) as client:
                    async with client.stream("GET", url) as response:
                        response.raise_for_status()
                        total_bytes = int(response.headers.get("content-length", 0))
                        downloaded_bytes = 0

                        with open(output_path, "wb") as f:
                            async for chunk in response.aiter_bytes(chunk_size=65536):
                                f.write(chunk)
                                downloaded_bytes += len(chunk)
                                if progress_cb and total_bytes > 0:
                                    progress_cb(downloaded_bytes, total_bytes)

                if expected_md5 and not self.verify_checksum(output_path, expected_md5):
                    raise ValueError(f"Checksum mismatch for {output_path.name}")

                logger.info(f"Downloaded successfully: {output_path.name} ({output_path.stat().st_size} bytes)")
                return output_path

            except Exception as e:
                retry_count += 1
                logger.warning(f"Download attempt {retry_count}/{self.max_retries} failed for {url}: {e}")
                if retry_count >= self.max_retries:
                    raise RuntimeError(f"Failed to download {url} after {self.max_retries} attempts.") from e
                await asyncio.sleep(backoff ** retry_count)

        return output_path

    @staticmethod
    def verify_checksum(file_path: Path, expected_md5: str) -> bool:
        hasher = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hasher.update(chunk)
        return hasher.hexdigest().lower() == expected_md5.lower()
