"""JSONExtractor for document & REST ocean dataset parsing."""
from typing import Any, Dict
from pathlib import Path
import json
from loguru import logger
from app.etl.base.parser import UnifiedParser


class JSONExtractor(UnifiedParser):
    """Extracts ocean observation objects from JSON/GeoJSON files."""

    def parse(self, file_path: Path) -> Dict[str, Any]:
        logger.info(f"Parsing JSON ocean file: {file_path.name}")
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return {"json_content": data, "source": "JSON Extractor"}
        except Exception as e:
            return {"json_content": {}, "source": "JSON Extractor Fallback"}
