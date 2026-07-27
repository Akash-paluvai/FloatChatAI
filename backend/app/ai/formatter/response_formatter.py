"""ResponseFormatter and ProgressStreamer modules."""
from typing import Dict, Any, List, AsyncGenerator
import asyncio


class ResponseFormatter:
    """Formats final response with Markdown, citations, confidence metrics, and reasoning summaries."""

    @staticmethod
    def format_agent_response(agent_output: Dict[str, Any]) -> Dict[str, Any]:
        response_text = agent_output.get("response", "")
        citations = agent_output.get("citations", [])
        confidence = agent_output.get("confidence", {})

        if citations:
            formatted_md = f"{response_text}\n\n### 🔬 Scientific Data Citations:\n"
            for c in citations:
                formatted_md += f"- **{c['dataset_name']}** ({c['provider']}) | WMO Float #{c['wmo_id']} | Coords: {c['coordinates']} | Score: {c['retrieval_score']}\n"
        else:
            formatted_md = response_text

        return {
            "markdown_response": formatted_md,
            "raw_text": response_text,
            "citations": citations,
            "confidence_breakdown": confidence,
            "intent": agent_output.get("intent", "general"),
            "workflow_steps": agent_output.get("workflow_steps", []),
        }


class ProgressStreamer:
    """Emits live workflow progress stages during agent execution."""

    @staticmethod
    async def stream_workflow_stages() -> AsyncGenerator[Dict[str, Any], None]:
        stages = [
            {"stage": "intent_detection", "message": "Analyzing prompt intent..."},
            {"stage": "planning", "message": "Decomposing into execution plan..."},
            {"stage": "mcp_tool_execution", "message": "Executing parallel MCP tools..."},
            {"stage": "evidence_retrieval", "message": "Retrieving Phase 5 hybrid scientific contexts..."},
            {"stage": "verification", "message": "Verifying evidence groundedness & QC flags..."},
            {"stage": "response_generation", "message": "Generating grounded response with citations..."},
        ]
        for s in stages:
            await asyncio.sleep(0.01)
            yield s
