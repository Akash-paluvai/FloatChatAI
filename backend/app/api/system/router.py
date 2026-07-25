"""System & Health Check API router."""
import time
from fastapi import APIRouter, Depends, Request
from app.config.settings import settings
from app.core.constants import SYSTEM_TAG_HEALTH
from app.schemas.response import APIResponse, ResponseMetadata
from app.schemas.health import HealthResponse
from app.dependencies.context import get_request_id

router = APIRouter(prefix="/health", tags=[SYSTEM_TAG_HEALTH])
START_TIME = time.time()


@router.get(
    "",
    response_model=APIResponse[HealthResponse],
    summary="Get System Health & Operational Status",
    description="Returns backend health, operational status, version, uptime, and configured dependencies."
)
async def get_health(request: Request, req_id: str = Depends(get_request_id)):
    uptime = time.time() - START_TIME
    health_data = HealthResponse(
        status="operational",
        app_name=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT.value,
        uptime_seconds=round(uptime, 2),
        dependencies={
            "database": "configured_placeholder",
            "redis_cache": "configured_placeholder",
            "vector_db": "configured_placeholder",
        }
    )
    return APIResponse[HealthResponse](
        success=True,
        message="FloatChat Backend Operational",
        data=health_data,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )
