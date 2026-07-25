"""Phase 7 REST API Routers for Agents, Visualization, and Scientific Reports."""
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field
from app.schemas.response import APIResponse, ResponseMetadata
from app.dependencies.context import get_request_id
from app.agents.registry.agent_registry import AgentRegistry
from app.agents.workers.all_workers import *
from app.agents.observability.multi_agent_benchmark import AgentMetricsCollector
from app.visualization.dashboard.dashboard_generator import DashboardGenerator
from app.reports.report_generator import ScientificReportGenerator

# 1. Agents Router
agents_router = APIRouter(prefix="/agents", tags=["Multi-Agent Intelligence Platform"])
_registry = AgentRegistry()
for _w in [RetrievalAgent, DatabaseAgent, StatisticsAgent, KnowledgeGraphAgent, VisualizationAgent, ExportAgent, ReasoningAgent, ValidationAgent, ResponseAgent]:
    _registry.register_agent(_w())


@agents_router.get("/status", summary="Get Live Status of All Registered Agents")
async def get_agents_status(request: Request, req_id: str = Depends(get_request_id)):
    agents_list = _registry.list_agents()
    return APIResponse[Dict[str, Any]](
        success=True,
        message="Agent status retrieved",
        data={"total_agents": len(agents_list), "agents": agents_list},
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )


@agents_router.get("/metrics", summary="Get Multi-Agent Execution Metrics")
async def get_agents_metrics(request: Request, req_id: str = Depends(get_request_id)):
    metrics = AgentMetricsCollector.get_agent_metrics()
    return APIResponse[Dict[str, Any]](
        success=True,
        message="Multi-agent metrics retrieved",
        data=metrics,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )


# 2. Visualization Router
viz_router = APIRouter(prefix="/visualization", tags=["3D & Profile Visualizations"])


class VizGenRequest(BaseModel):
    viz_type: str = Field(default="temperature_profile", json_schema_extra={"example": "temperature_profile"})
    ocean_region: str = Field(default="Bay of Bengal")


@viz_router.post("/generate", summary="Generate Scientific Chart & Interactive Dashboard Specs")
async def generate_visualization(payload: VizGenRequest, request: Request, req_id: str = Depends(get_request_id)):
    dash = DashboardGenerator.create_dashboard_layout(payload.ocean_region)
    return APIResponse[Dict[str, Any]](
        success=True,
        message="Plotly visualization & dashboard specs generated",
        data=dash,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )


# 3. Reports Router
report_router = APIRouter(prefix="/report", tags=["Automated Scientific Reports"])


class ReportGenRequest(BaseModel):
    title: str = Field(default="ARGO Hydrographic Report - Bay of Bengal")
    ocean_region: str = Field(default="Bay of Bengal")
    summary_text: str = Field(default="ARGO float observations show temperature profiles averaging 28.3°C at surface.")


@report_router.post("/generate", summary="Generate Export-Ready Scientific Report (Markdown/HTML/PDF)")
async def generate_report(payload: ReportGenRequest, request: Request, req_id: str = Depends(get_request_id)):
    report = ScientificReportGenerator.generate_report(payload.title, payload.ocean_region, payload.summary_text)
    return APIResponse[Dict[str, Any]](
        success=True,
        message="Scientific report generated",
        data=report,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )
