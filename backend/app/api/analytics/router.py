"""Analytics & Query API router."""
from fastapi import APIRouter, Depends, Request
from app.core.constants import SYSTEM_TAG_ANALYTICS
from app.schemas.response import APIResponse, ResponseMetadata
from app.schemas.ocean import OceanQueryRequest, OceanQueryResponse
from app.services.ocean import OceanService
from app.dependencies.context import get_request_id

router = APIRouter(prefix="/query", tags=[SYSTEM_TAG_ANALYTICS])


@router.post(
    "",
    response_model=APIResponse[OceanQueryResponse],
    summary="Execute Oceanographic Query",
    description="Accepts scientific ocean query payload and returns spatial float metadata & depth profile data."
)
async def post_query(
    payload: OceanQueryRequest,
    request: Request,
    req_id: str = Depends(get_request_id)
):
    service = OceanService()
    query_resp = await service.execute_query(payload)
    return APIResponse[OceanQueryResponse](
        success=True,
        message="Ocean query executed successfully",
        data=query_resp,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )
