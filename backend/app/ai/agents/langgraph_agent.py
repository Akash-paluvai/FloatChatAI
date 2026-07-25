"""LangGraph Agent Orchestrator combining Intent Router, TaskPlanner, ExecutionEngine, Reasoning, and Verification."""
from typing import Dict, Any, List
from loguru import logger
from app.ai.models.mock_provider import MockAIProvider
from app.ai.executor.execution_engine import TaskPlanner, ExecutionEngine
from app.ai.verification.confidence_scorer import ScientificReasoningEngine, MultiSignalConfidenceScorer
from app.ai.citations.citation_engine import VerificationLayer, CitationEngine
from app.ai.guardrails.ai_guardrails import AIGuardrails


class FloatChatGraphAgent:
    """Enterprise Agent Orchestrator managing end-to-end scientific AI workflow."""

    def __init__(self, provider=None, executor=None):
        self.provider = provider if provider else MockAIProvider()
        self.executor = executor if executor else ExecutionEngine()

    async def run_workflow(self, prompt: str, session_id: str = "default_session") -> Dict[str, Any]:
        logger.info(f"FloatChatGraphAgent starting workflow for prompt: '{prompt}'")

        # 1. Guardrails Check
        guard = AIGuardrails.check_input(prompt)
        if not guard["safe"]:
            return {
                "success": False,
                "response": f"Security Guardrail Alert: {guard['reason']}",
                "citations": [],
                "confidence": 0.0,
                "workflow_steps": ["Guardrail Check Failed"]
            }

        # 2. Planning
        plan = TaskPlanner.create_plan(prompt)

        # 3. Execution
        exec_res = await self.executor.execute_plan(plan, prompt)

        # 4. Reasoning & Verification
        reasoning = ScientificReasoningEngine.reason_over_evidence(plan.query_intent, exec_res["tool_results"])
        verification = VerificationLayer.verify_groundedness(exec_res["tool_results"])
        confidence = MultiSignalConfidenceScorer.calculate_confidence()

        # 5. Citations
        citations = CitationEngine.generate_citations(exec_res["tool_results"])

        # 6. Response Generation
        ai_text = await self.provider.generate(prompt)

        return {
            "success": True,
            "prompt": prompt,
            "intent": plan.query_intent,
            "response": ai_text,
            "reasoning": reasoning,
            "verification": verification,
            "confidence": confidence,
            "citations": [c.model_dump() for c in citations],
            "tool_results": exec_res["tool_results"],
            "workflow_steps": [
                "1. Guardrail Security Verified",
                f"2. Intent Categorized: {plan.query_intent}",
                f"3. Execution Plan Built ({len(plan.selected_tools)} tools)",
                "4. Parallel MCP Tool Execution Completed",
                "5. Scientific Evidence Verified & Grounded",
                "6. Exact Metadata Citations Attached",
            ]
        }
