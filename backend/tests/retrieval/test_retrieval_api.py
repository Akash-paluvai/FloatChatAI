"""Test Retrieval API Endpoints."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_retrieval_search_endpoint(async_client: AsyncClient):
    payload = {"query": "Temperature profile in Bay of Bengal", "top_k": 3}
    response = await async_client.post("/api/v1/retrieval/search", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "data" in json_data
    assert "context_blocks" in json_data["data"]


@pytest.mark.asyncio
async def test_retrieval_stats_endpoint(async_client: AsyncClient):
    response = await async_client.get("/api/v1/retrieval/stats")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "vector_store" in json_data["data"]
