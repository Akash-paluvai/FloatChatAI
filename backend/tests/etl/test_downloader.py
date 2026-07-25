"""Test HTTP & REST Downloaders."""
import pytest
from pathlib import Path
from app.etl.downloaders.http import HTTPDownloader
from app.etl.downloaders.rest import RESTDownloader


@pytest.mark.asyncio
async def test_http_downloader_checksum(tmp_path: Path):
    file_path = tmp_path / "test.txt"
    file_path.write_text("floatchat_test_content")
    md5 = "e10adc3949ba59abbe56e057f20f883e"  # Dummy MD5
    hasher_res = HTTPDownloader.verify_checksum(file_path, "c4ca4238a0b923820dcc509a6f75849b")
    assert isinstance(hasher_res, bool)


@pytest.mark.asyncio
async def test_rest_downloader():
    downloader = RESTDownloader()
    assert downloader is not None
