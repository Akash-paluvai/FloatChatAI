"""Chat API router integrated with Phase 6 & 7 AI Multi-Agent Orchestrator."""
from fastapi import APIRouter, Depends, Request
from loguru import logger
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
    description="Accepts natural language user prompt, executes Phase 6/7 multi-agent orchestration, MCP tools, verification, grounded citations, and returns structured scientific artifacts."
)
async def post_chat(
    payload: ChatRequest,
    request: Request,
    req_id: str = Depends(get_request_id)
):
    prompt_text = payload.get_prompt_text()
    logger.info(f"[CHAT-ENDPOINT] Received prompt: '{prompt_text}'")

    agent_output = await agent.run_workflow(prompt_text, session_id=payload.session_id or "session_default")
    formatted = ResponseFormatter.format_agent_response(agent_output)

    confidence = agent_output.get("confidence")
    overall_confidence = confidence.get("overall_confidence", 0.96) if isinstance(confidence, dict) else (confidence or 0.96)

    viz_spec = agent_output.get("viz_spec")
    analytics = agent_output.get("analytical_summary", {})
    gen_sql = agent_output.get("generated_sql")
    citations = formatted["citations"]

    df_sample = agent_output.get("tool_results", {}).get("notebook_dataframe_sample", {})

    artifacts = {
        "visualization": viz_spec,
        "statistics": analytics,
        "data_table": df_sample,
        "sql_query": gen_sql,
        "citations": citations
    }

    chat_resp = ChatResponse(
        session_id=payload.session_id or "session_default",
        message_id=f"msg_ai_{req_id[:8]}",
        status="PROCESSED_BY_AI_ORCHESTRATOR",
        response_text=formatted["markdown_response"],
        content=formatted["markdown_response"],
        generated_sql=gen_sql,
        citations=citations,
        confidence_score=overall_confidence,
        sources=["ARGO GDAC", "Phase 5 Semantic Retrieval", "PostgreSQL/PostGIS"] if citations else ["FloatChat AI Engine"],
        analytical_summary=analytics,
        viz_spec=viz_spec,
        artifacts=artifacts,
        suggested_followups=agent_output.get("suggested_followups", [
            "Show temperature depth profiles near Bay of Bengal",
            "Plot 3D hydrographic section in Arabian Sea",
            "Track ARGO float #2901234 trajectory"
        ])
    )

    return APIResponse[ChatResponse](
        success=True,
        message="Natural language prompt processed by Phase 6/7 AI Orchestration Layer with structured scientific artifacts",
        data=chat_resp,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )
