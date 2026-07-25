"""INCOIS Data Provider implementation."""
from typing import Any, Dict, List
from pathlib import Path
from app.etl.base.provider import BaseProvider


class INCOISProvider(BaseProvider):
    def __init__(self):
        super().__init__(name="INCOIS")

    async def download(self, target_dir: Path, **kwargs) -> List[Path]:
        f = target_dir / "incois_sample.csv"
        f.parent.mkdir(parents=True, exist_ok=True)
        f.touch()
        return [f]

    async def extract(self, file_path: Path) -> Dict[str, Any]:
        return {"source": "INCOIS", "platform_id": 2901237, "latitude": 8.2, "longitude": 92.1, "ocean_region": "Bay of Bengal", "variables": {"temp_c": [28.8], "salinity_psu": [33.0]}}

    async def validate(self, raw_data: Dict[str, Any]) -> bool:
        return True

    async def transform(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        return raw_data

    async def metadata(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        return {"provider": self.name, "source": "INCOIS Indian Ocean Data Center"}
