"""Test Phase 6 AI Agent Orchestrator & API Endpoints."""
import pytest
from httpx import AsyncClient
from app.ai.agents.langgraph_agent import FloatChatGraphAgent
from app.ai.mcp.registry import mcp_server


@pytest.mark.asyncio
async def test_ai_agent_workflow():
    agent = FloatChatGraphAgent()
    res = await agent.run_workflow("Show temperature profiles in Bay of Bengal")
    assert res["success"] is True
    assert "response" in res
    assert "citations" in res
    assert len(res["citations"]) > 0
    assert res["confidence"]["overall_confidence"] > 0.8


@pytest.mark.asyncio
async def test_mcp_tools_execution():
    tool_res = await mcp_server.call_tool("ocean_statistics_calculator", {"ocean_region": "Bay of Bengal"})
    assert tool_res.ocean_region == "Bay of Bengal"
    assert tool_res.mean_temperature_c > 0.0


@pytest.mark.asyncio
async def test_chat_api_phase6(async_client: AsyncClient):
    payload = {"prompt": "What is the temperature trend near Bay of Bengal?"}
    response = await async_client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "citations" in json_data["data"]
    assert json_data["data"]["confidence_score"] > 0.8
