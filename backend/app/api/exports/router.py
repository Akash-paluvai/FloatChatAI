"""Export API router."""
from fastapi import APIRouter, Depends, Request
from app.core.constants import SYSTEM_TAG_EXPORTS
from app.schemas.response import APIResponse, ResponseMetadata
from app.schemas.export import ExportRequest, ExportResponse
from app.services.visualization import ExportService
from app.dependencies.context import get_request_id

router = APIRouter(prefix="/export", tags=[SYSTEM_TAG_EXPORTS])


@router.post(
    "",
    response_model=APIResponse[ExportResponse],
    summary="Export Ocean Dataset Subset",
    description="Generates export file download link for CSV, Parquet, or GeoJSON subsets."
)
async def post_export(
    payload: ExportRequest,
    request: Request,
    req_id: str = Depends(get_request_id)
):
    service = ExportService()
    exp_resp = await service.create_export(payload)
    return APIResponse[ExportResponse](
        success=True,
        message="Export job completed",
        data=exp_resp,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )
