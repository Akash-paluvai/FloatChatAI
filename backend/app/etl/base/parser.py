"""UnifiedParser abstract interface."""
from abc import ABC, abstractmethod
from typing import Any, Dict
from pathlib import Path


class UnifiedParser(ABC):
    """Unified Parser contract for scientific file formats (NetCDF, NetCDF4, CSV, JSON, GeoJSON, HDF5)."""

    @abstractmethod
    def parse(self, file_path: Path) -> Dict[str, Any]:
        """Parse raw file content into standard variable dictionary."""
        raise NotImplementedError()
