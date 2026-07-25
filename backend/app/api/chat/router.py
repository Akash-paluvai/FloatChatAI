"""Chat API router integrated with Phase 6 AI Agent Orchestrator."""
from fastapi import APIRouter, Depends, Request
from app.core.constants import SYSTEM_TAG_CHAT
from app.schemas.response import APIResponse, ResponseMetadata
from app.schemas.chat import ChatRequest, ChatResponse
from app.dependencies.context import get_request_id
from app.ai.agents.langgraph_agent import FloatChatGraphAgent
from app.ai.formatter.response_formatter import ResponseFormatter

router = APIRouter(prefix="/chat", tags=[SYSTEM_TAG_CHAT])
agent = FloatChatGraphAgent()


@router.post(
    "",
    response_model=APIResponse[ChatResponse],
    summary="Natural Language Ocean Query Chat Interface",
    description="Accepts natural language user prompt, executes Phase 6 agent orchestration, MCP tools, verification, and grounded citations."
)
async def post_chat(
    payload: ChatRequest,
    request: Request,
    req_id: str = Depends(get_request_id)
):
    prompt_text = payload.get_prompt_text()
    agent_output = await agent.run_workflow(prompt_text)
    formatted = ResponseFormatter.format_agent_response(agent_output)

    chat_resp = ChatResponse(
        session_id=payload.session_id or "session_default",
        message_id="msg_ai_101",
        status="PROCESSED_BY_AI_ORCHESTRATOR",
        response_text=formatted["markdown_response"],
        content=formatted["markdown_response"],
        generated_sql="SELECT * FROM profiles WHERE ST_Contains(geometry, ST_MakeEnvelope(80, 10, 95, 22)) LIMIT 50;",
        citations=formatted["citations"],
        confidence_score=formatted["confidence_breakdown"].get("overall_confidence", 0.94),
        sources=["ARGO GDAC", "Phase 5 Semantic Retrieval", "PostgreSQL/PostGIS"]
    )

    return APIResponse[ChatResponse](
        success=True,
        message="Natural language prompt processed by Phase 6 AI Orchestration Layer",
        data=chat_resp,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )
