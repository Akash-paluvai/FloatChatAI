"""DatabaseProvider abstract interface (Future PostgreSQL / PostGIS)."""
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class DatabaseProvider(ABC):
    """Abstract interface for relational & spatial database operations."""

    @abstractmethod
    async def execute_query(self, sql_query: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        raise NotImplementedError("DatabaseProvider execute_query will be implemented in Phase 4.")

    @abstractmethod
    async def health_check(self) -> bool:
        raise NotImplementedError()


class MockDatabaseProvider(DatabaseProvider):
    async def execute_query(self, sql_query: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        return [{"status": "Phase 4 PostgreSQL Integration Pending", "sql": sql_query}]

    async def health_check(self) -> bool:
        return True
