"""VisualizationService & ExportService implementation."""
import uuid
from app.schemas.visualization import VisualizationRequest, VisualizationResponse
from app.schemas.export import ExportRequest, ExportResponse
from app.repositories.float_repo import VisualizationRepository, ExportRepository


class VisualizationService:
    async def create_visualization(self, request: VisualizationRequest) -> VisualizationResponse:
        repo = VisualizationRepository()
        viz = await repo.get_by_id("viz-101")
        return VisualizationResponse(
            visualization_id=f"viz_{uuid.uuid4().hex[:8]}",
            viz_type=request.viz_type,
            ocean_region=request.ocean_region,
            plotly_config=viz.plotly_config if viz else {"type": "scatter", "mode": "lines"}
        )


class ExportService:
    async def create_export(self, request: ExportRequest) -> ExportResponse:
        repo = ExportRepository()
        raw = await repo.generate_export(request.ocean_region, request.export_format)
        return ExportResponse(
            export_id=raw["export_id"],
            file_name=raw["file_name"],
            file_size=raw["file_size"],
            download_url=raw["download_url"],
            status=raw["status"]
        )
