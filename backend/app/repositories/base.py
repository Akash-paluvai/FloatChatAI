"""Abstract Base Repository Interface."""
from typing import Generic, List, Optional, TypeVar
from abc import ABC, abstractmethod

T = TypeVar("T")


class BaseRepository(ABC, Generic[T]):
    """Generic repository contract for data access layer."""

    @abstractmethod
    async def get_by_id(self, id: str) -> Optional[T]:
        raise NotImplementedError("Repository get_by_id method not implemented yet.")

    @abstractmethod
    async def list_all(self, limit: int = 100, offset: int = 0) -> List[T]:
        raise NotImplementedError("Repository list_all method not implemented yet.")

    @abstractmethod
    async def create(self, entity: T) -> T:
        raise NotImplementedError("Repository create method not implemented yet.")
