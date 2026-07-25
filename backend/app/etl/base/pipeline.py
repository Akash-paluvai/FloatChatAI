"""ETLPipeline orchestrator."""
from typing import Dict, Any, List
from pathlib import Path
from loguru import logger
from app.etl.base.provider import BaseProvider


class ETLPipeline:
    """Orchestrates stage-by-stage ETL execution: Download -> Extract -> Validate -> Transform -> Metadata."""

    def __init__(self, provider: BaseProvider):
        self.provider = provider

    async def run_pipeline(self, target_dir: Path) -> List[Dict[str, Any]]:
        logger.info(f"Starting ETL Pipeline for Provider: {self.provider.name}")

        # Stage 1: Download
        downloaded_files = await self.provider.download(target_dir)
        logger.info(f"[{self.provider.name}] Stage 1 Download Complete: {len(downloaded_files)} files")

        results = []
        for file_path in downloaded_files:
            # Stage 2: Extract
            extracted = await self.provider.extract(file_path)

            # Stage 3: Validate
            is_valid = await self.provider.validate(extracted)
            if not is_valid:
                logger.warning(f"[{self.provider.name}] Stage 3 Validation Failed for file: {file_path.name}")
                continue

            # Stage 4: Transform
            transformed = await self.provider.transform(extracted)

            # Stage 5: Metadata
            meta = await self.provider.metadata(transformed)

            results.append({
                "file_path": str(file_path),
                "data": transformed,
                "metadata": meta,
                "status": "ReadyForDatabase",
            })

        logger.info(f"[{self.provider.name}] ETL Pipeline Completed: {len(results)} datasets ready")
        return results
