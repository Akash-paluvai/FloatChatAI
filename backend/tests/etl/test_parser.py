"""Test Extractors & Parsers."""
import pytest
from pathlib import Path
from app.etl.extractors.netcdf import NetCDFExtractor
from app.etl.extractors.csv_parser import CSVExtractor
from app.etl.extractors.json_parser import JSONExtractor


def test_netcdf_extractor_parse(tmp_path: Path):
    f = tmp_path / "test.nc"
    f.write_bytes(b"MOCK_NETCDF")
    extractor = NetCDFExtractor()
    res = extractor.parse(f)
    assert "platform_id" in res
    assert "variables" in res
    assert "temp_c" in res["variables"]


def test_csv_extractor_parse(tmp_path: Path):
    f = tmp_path / "test.csv"
    f.write_text("depth_m,temp_c,salinity_psu\n0.0,28.5,33.2\n")
    extractor = CSVExtractor()
    res = extractor.parse(f)
    assert res["rows_count"] == 1
    assert "depth_m" in res["columns"]


def test_json_extractor_parse(tmp_path: Path):
    f = tmp_path / "test.json"
    f.write_text('{"platform_id": "2901234"}')
    extractor = JSONExtractor()
    res = extractor.parse(f)
    assert "json_content" in res
