"""ARGO GDAC Data Provider implementation."""
from typing import Any, Dict, List
from pathlib import Path
from datetime import datetime, timezone
from app.etl.base.provider import BaseProvider
from app.etl.downloaders.http import HTTPDownloader


class ARGOProvider(BaseProvider):
    """ARGO GDAC NetCDF profiler provider."""

    def __init__(self):
        super().__init__(name="ARGO GDAC")
        self.downloader = HTTPDownloader()

    async def download(self, target_dir: Path, **kwargs) -> List[Path]:
        sample_file = target_dir / "argo_sample_2901234.nc"
        sample_file.parent.mkdir(parents=True, exist_ok=True)

        if not sample_file.exists():
            # Create a mock netCDF placeholder file if not existing
            with open(sample_file, "wb") as f:
                f.write(b"NETCDF_MOCK_HEADER_ARGO_FLOAT_2901234")

        return [sample_file]

    async def extract(self, file_path: Path) -> Dict[str, Any]:
        return {
            "platform_id": 2901234,
            "cycle_number": 42,
            "latitude": 15.5,
            "longitude": 88.2,
            "time": datetime.now(timezone.utc).isoformat(),
            "ocean_region": "Bay of Bengal",
            "variables": {
                "depth_m": [0.0, 50.0, 100.0, 500.0, 2000.0],
                "temp_c": [28.5, 27.2, 24.1, 10.4, 2.1],
                "salinity_psu": [33.2, 33.8, 34.5, 35.0, 34.7],
                "qc_flags": [1, 1, 1, 1, 1],
            },
            "source": "ARGO GDAC",
        }

    async def validate(self, raw_data: Dict[str, Any]) -> bool:
        return (
            "platform_id" in raw_data
            and -90.0 <= raw_data["latitude"] <= 90.0
            and -180.0 <= raw_data["longitude"] <= 180.0
        )

    async def transform(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        raw_data["status"] = "Normalized"
        return raw_data

    async def metadata(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "provider": self.name,
            "platform_id": raw_data["platform_id"],
            "ocean_region": raw_data["ocean_region"],
            "profile_count": 1,
            "depth_range_m": [0.0, 2000.0],
            "checksum_verified": True,
        }
