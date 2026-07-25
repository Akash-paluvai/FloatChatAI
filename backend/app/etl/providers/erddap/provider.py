"""ERDDAP, Argovis, & INCOIS Data Provider implementations."""
from typing import Any, Dict, List
from pathlib import Path
from datetime import datetime, timezone
from app.etl.base.provider import BaseProvider


class ERDDAPProvider(BaseProvider):
    def __init__(self):
        super().__init__(name="ERDDAP")

    async def download(self, target_dir: Path, **kwargs) -> List[Path]:
        f = target_dir / "erddap_sample.json"
        f.parent.mkdir(parents=True, exist_ok=True)
        f.touch()
        return [f]

    async def extract(self, file_path: Path) -> Dict[str, Any]:
        return {"source": "ERDDAP", "platform_id": 2901235, "latitude": 12.1, "longitude": 68.4, "ocean_region": "Arabian Sea", "variables": {"temp_c": [27.9], "salinity_psu": [36.2]}}

    async def validate(self, raw_data: Dict[str, Any]) -> bool:
        return True

    async def transform(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        return raw_data

    async def metadata(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        return {"provider": self.name, "source": "ERDDAP REST"}


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
