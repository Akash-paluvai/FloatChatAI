"""Dataset Repository interface."""
from typing import List, Optional
from app.repositories.base import BaseRepository
from app.domain.entities.dataset import Dataset


class DatasetRepository(BaseRepository[Dataset]):
    async def get_by_id(self, id: str) -> Optional[Dataset]:
        return Dataset(
            id=id,
            name="ARGO Bay of Bengal 2024 Filtered",
            source="ARGO",
            year=2024,
            record_count=482000,
            file_size_bytes=3100000000,
            format="Parquet",
        )

    async def list_all(self, limit: int = 100, offset: int = 0) -> List[Dataset]:
        return [
            Dataset(id="ds-1", name="ARGO Bay of Bengal 2024 Filtered", source="ARGO", year=2024, record_count=482000, file_size_bytes=3328599654, format="Parquet"),
            Dataset(id="ds-2", name="ERDDAP Arabian Sea 2023 Cleaned", source="ERDDAP", year=2023, record_count=512000, file_size_bytes=3543348019, format="Parquet"),
            Dataset(id="ds-3", name="Argovis Indian Ocean Historic 2022", source="Argovis", year=2022, record_count=420000, file_size_bytes=3006477107, format="NetCDF"),
            Dataset(id="ds-4", name="INCOIS Global ARGO Trajectories 2024", source="INCOIS", year=2024, record_count=1200000, file_size_bytes=10093173145, format="CSV"),
        ]

    async def create(self, entity: Dataset) -> Dataset:
        raise NotImplementedError("Dataset repository creation will be implemented with PostgreSQL in Phase 4.")
