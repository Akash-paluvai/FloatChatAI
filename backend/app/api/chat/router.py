"""Chat API router."""
from fastapi import APIRouter, Depends, Request
from app.core.constants import SYSTEM_TAG_CHAT
from app.schemas.response import APIResponse, ResponseMetadata
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat import ChatService
from app.dependencies.context import get_request_id

router = APIRouter(prefix="/chat", tags=[SYSTEM_TAG_CHAT])


@router.post(
    "",
    response_model=APIResponse[ChatResponse],
    summary="Natural Language Ocean Query Chat Interface",
    description="Accepts natural language user prompt and returns structured analytical response & query translation."
)
async def post_chat(
    payload: ChatRequest,
    request: Request,
    req_id: str = Depends(get_request_id)
):
    service = ChatService()
    chat_resp = await service.process_chat(payload)
    return APIResponse[ChatResponse](
        success=True,
        message="Natural language prompt processed",
        data=chat_resp,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )
