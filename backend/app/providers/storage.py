"""CacheProvider, VectorProvider, FileProvider & StorageProvider abstract interfaces."""
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class CacheProvider(ABC):
    @abstractmethod
    async def get(self, key: str) -> Optional[str]:
        raise NotImplementedError()

    @abstractmethod
    async def set(self, key: str, value: str, ttl_seconds: int = 300) -> bool:
        raise NotImplementedError()


class VectorProvider(ABC):
    @abstractmethod
    async def similarity_search(self, query_text: str, top_k: int = 5) -> List[Dict[str, Any]]:
        raise NotImplementedError("VectorProvider will be connected in Phase 6.")


class FileProvider(ABC):
    @abstractmethod
    async def read_parquet(self, file_path: str) -> Dict[str, Any]:
        raise NotImplementedError("FileProvider will be connected in Phase 3.")

    @abstractmethod
    async def write_export(self, file_name: str, content: bytes) -> str:
        raise NotImplementedError()


class StorageProvider(ABC):
    @abstractmethod
    async def get_storage_stats(self) -> Dict[str, Any]:
        raise NotImplementedError()


# Mock Default Implementations
class MockCacheProvider(CacheProvider):
    async def get(self, key: str) -> Optional[str]:
        return None

    async def set(self, key: str, value: str, ttl_seconds: int = 300) -> bool:
        return True


class MockVectorProvider(VectorProvider):
    async def similarity_search(self, query_text: str, top_k: int = 5) -> List[Dict[str, Any]]:
        return [{"embedding_id": "vec-101", "score": 0.98, "metadata": {"region": "Bay of Bengal"}}]


class MockFileProvider(FileProvider):
    async def read_parquet(self, file_path: str) -> Dict[str, Any]:
        return {"rows": 1000, "status": "Mock Parquet Reader"}

    async def write_export(self, file_name: str, content: bytes) -> str:
        return f"/data/exports/{file_name}"


class MockStorageProvider(StorageProvider):
    async def get_storage_stats(self) -> Dict[str, Any]:
        return {"total_parquet_gb": 18.5, "status": "Phase 2 Mock Storage"}
