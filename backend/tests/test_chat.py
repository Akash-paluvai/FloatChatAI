"""Test Chat, Query & Datasets API endpoints."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_chat_endpoint(async_client: AsyncClient):
    payload = {"message": "Show temperature near Bay of Bengal", "ocean_region": "Bay of Bengal"}
    response = await async_client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["status"] == "PROCESSED_BY_AI_ORCHESTRATOR"
    assert "citations" in json_data["data"]


@pytest.mark.asyncio
async def test_query_endpoint(async_client: AsyncClient):
    payload = {"query_text": "Thermocline depth in Indian Ocean", "ocean_region": "Bay of Bengal"}
    response = await async_client.post("/api/v1/query", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "floats" in json_data["data"]


@pytest.mark.asyncio
async def test_datasets_endpoint(async_client: AsyncClient):
    response = await async_client.get("/api/v1/datasets")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["total_datasets"] >= 4
