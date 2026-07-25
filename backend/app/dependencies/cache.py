"""Cache dependency placeholder for future Redis layer."""
from typing import Optional


class CacheDependency:
    """Dependency placeholder for CacheProvider / Redis integration."""
    async def get(self, key: str) -> Optional[str]:
        return None

    async def set(self, key: str, value: str, ttl: int = 300) -> None:
        pass


def get_cache() -> CacheDependency:
    return CacheDependency()
