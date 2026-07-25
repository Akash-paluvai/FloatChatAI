"""Argovis API Data Provider implementation."""
from typing import Any, Dict, List
from pathlib import Path
from app.etl.base.provider import BaseProvider


class ArgovisProvider(BaseProvider):
    def __init__(self):
        super().__init__(name="Argovis API")

    async def download(self, target_dir: Path, **kwargs) -> List[Path]:
        f = target_dir / "argovis_sample.json"
        f.parent.mkdir(parents=True, exist_ok=True)
        f.touch()
        return [f]

    async def extract(self, file_path: Path) -> Dict[str, Any]:
        return {"source": "Argovis API", "platform_id": 2901236, "latitude": -18.4, "longitude": 75.3, "ocean_region": "Southern Ocean", "variables": {"temp_c": [21.3], "salinity_psu": [35.1]}}

    async def validate(self, raw_data: Dict[str, Any]) -> bool:
        return True

    async def transform(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        return raw_data

    async def metadata(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        return {"provider": self.name, "source": "Argovis REST"}
