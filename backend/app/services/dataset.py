"""DatasetService for retrieving open ocean datasets."""
from app.repositories.dataset import DatasetRepository
from app.schemas.dataset import DatasetInfo, DatasetListResponse


class DatasetService:
    def __init__(self):
        self.repo = DatasetRepository()

    async def list_datasets() -> DatasetListResponse:
        repo = DatasetRepository()
        raw_datasets = await repo.list_all()
        ds_infos = [
            DatasetInfo(
                id=d.id,
                name=d.name,
                source=d.source,
                year=d.year,
                record_count=f"{d.record_count:,}",
                file_size=f"{d.file_size_bytes / (1024**3):.1f} GB",
                format=d.format,
                status=d.status,
                download_url=f"/api/v1/datasets/download/{d.id}"
            )
            for d in raw_datasets
        ]
        return DatasetListResponse(total_datasets=len(ds_infos), datasets=ds_infos)
