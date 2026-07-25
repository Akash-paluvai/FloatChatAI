"""Datasets API router."""
from fastapi import APIRouter, Depends, Request
from app.core.constants import SYSTEM_TAG_DATASETS
from app.schemas.response import APIResponse, ResponseMetadata
from app.schemas.dataset import DatasetListResponse
from app.services.dataset import DatasetService
from app.dependencies.context import get_request_id

router = APIRouter(prefix="/datasets", tags=[SYSTEM_TAG_DATASETS])


@router.get(
    "",
    response_model=APIResponse[DatasetListResponse],
    summary="List Open Ocean Datasets",
    description="Returns available open science datasets (ARGO, ERDDAP, Argovis, INCOIS)."
)
async def get_datasets(request: Request, req_id: str = Depends(get_request_id)):
    service = DatasetService()
    ds_resp = await service.list_datasets()
    return APIResponse[DatasetListResponse](
        success=True,
        message="Datasets retrieved successfully",
        data=ds_resp,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )
