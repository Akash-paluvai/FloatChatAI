"""Visualization API router."""
from fastapi import APIRouter, Depends, Request
from app.core.constants import SYSTEM_TAG_VISUALIZATION
from app.schemas.response import APIResponse, ResponseMetadata
from app.schemas.visualization import VisualizationRequest, VisualizationResponse
from app.services.visualization import VisualizationService
from app.dependencies.context import get_request_id

router = APIRouter(prefix="/visualizations", tags=[SYSTEM_TAG_VISUALIZATION])


@router.post(
    "",
    response_model=APIResponse[VisualizationResponse],
    summary="Create Visualization Config",
    description="Returns Plotly graph configuration and metadata for temperature/salinity profiles."
)
async def post_visualization(
    payload: VisualizationRequest,
    request: Request,
    req_id: str = Depends(get_request_id)
):
    service = VisualizationService()
    viz_resp = await service.create_visualization(payload)
    return APIResponse[VisualizationResponse](
        success=True,
        message="Visualization metadata generated",
        data=viz_resp,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )
