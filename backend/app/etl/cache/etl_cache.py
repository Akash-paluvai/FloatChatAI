"""ETLCache local disk & metadata cache."""
from typing import Optional
from pathlib import Path
import json
import hashlib
from app.etl.config import etl_config


class ETLCache:
    """Local disk cache preventing duplicate file downloads and re-processing."""

    def __init__(self, cache_dir: Path = etl_config.CACHE_DIR):
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def is_cached(self, key: str) -> bool:
        cache_file = self.cache_dir / f"{hashlib.md5(key.encode()).hexdigest()}.json"
        return cache_file.exists()

    def get_cached(self, key: str) -> Optional[dict]:
        cache_file = self.cache_dir / f"{hashlib.md5(key.encode()).hexdigest()}.json"
        if cache_file.exists():
            with open(cache_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return None

    def set_cached(self, key: str, payload: dict) -> None:
        cache_file = self.cache_dir / f"{hashlib.md5(key.encode()).hexdigest()}.json"
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(payload, f)
