"""Abstract BaseProvider interface for ocean data providers."""
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pathlib import Path


class BaseProvider(ABC):
    """Abstract contract that every scientific ocean data provider must implement."""

    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    async def download(self, target_dir: Path, **kwargs) -> List[Path]:
        """Download raw data files from provider source."""
        raise NotImplementedError()

    @abstractmethod
    async def extract(self, file_path: Path) -> Dict[str, Any]:
        """Extract variables, dimensions, coordinates, and metadata from file."""
        raise NotImplementedError()

    @abstractmethod
    async def validate(self, raw_data: Dict[str, Any]) -> bool:
        """Validate dataset against schema and integrity rules."""
        raise NotImplementedError()

    @abstractmethod
    async def transform(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize units, variable names, and spatial attributes."""
        raise NotImplementedError()

    @abstractmethod
    async def metadata(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract dataset metadata sidecar dictionary."""
        raise NotImplementedError()
