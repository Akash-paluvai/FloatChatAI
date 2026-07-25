"""Test Multi-Agent Intelligence REST API Endpoints."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_agents_status_endpoint(async_client: AsyncClient):
    response = await async_client.get("/api/v1/agents/status")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["total_agents"] >= 9


@pytest.mark.asyncio
async def test_agents_metrics_endpoint(async_client: AsyncClient):
    response = await async_client.get("/api/v1/agents/metrics")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "parallel_execution_speedup_ratio" in json_data["data"]


@pytest.mark.asyncio
async def test_visualization_generate_endpoint(async_client: AsyncClient):
    payload = {"viz_type": "temperature_profile", "ocean_region": "Bay of Bengal"}
    response = await async_client.post("/api/v1/visualization/generate", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "panels" in json_data["data"]


@pytest.mark.asyncio
async def test_report_generate_endpoint(async_client: AsyncClient):
    payload = {"title": "Bay of Bengal Report", "ocean_region": "Bay of Bengal", "summary_text": "ARGO profiles summary"}
    response = await async_client.post("/api/v1/report/generate", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "markdown_report" in json_data["data"]
