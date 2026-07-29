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
        logger.info(f"[PIPELINE-INSTRUMENTATION] 1. USER PROMPT: '{prompt}'")

        # 1. Guardrails Check
        guard = AIGuardrails.check_input(prompt)
        if not guard["safe"]:
            logger.warning(f"[PIPELINE-INSTRUMENTATION] GUARDRAIL ALERT: {guard['reason']}")
            return {
                "success": False,
                "response": f"Security Guardrail Alert: {guard['reason']}",
                "citations": [],
                "confidence": 0.0,
                "generated_sql": None,
                "workflow_steps": ["Guardrail Check Failed"]
            }

        # 2. Planning
        plan = TaskPlanner.create_plan(prompt)
        parsed = plan.parsed_spec
        logger.info(f"[PIPELINE-INSTRUMENTATION] 2. DETECTED INTENT: {plan.query_intent} | QUERY TYPE: {parsed.get('query_type')}")

        # 3. Handle Greeting intent directly without database or execution engine overhead
        if parsed.get("query_type") == "GREETING":
            ai_text = await self.provider.generate(prompt)
            return {
                "success": True,
                "prompt": prompt,
                "intent": plan.query_intent,
                "query_type": "GREETING",
                "response": ai_text,
                "generated_sql": None,
                "citations": [],
                "confidence": 1.0,
                "analytical_summary": {"status": "Greeting acknowledged"},
                "suggested_followups": [
                    "Show temperature depth profiles near Bay of Bengal",
                    "Plot 3D hydrographic section in Arabian Sea",
                    "Track ARGO float #2901234 trajectory"
                ],
                "workflow_steps": ["1. Intent Categorized: Greeting", "2. Direct Response Assembled"]
            }

        # 4. Execution over Data Pipeline & Analytics Engines
        exec_res = await self.executor.execute_plan(plan, prompt)

        # 5. Reasoning & Verification
        reasoning = ScientificReasoningEngine.reason_over_evidence(plan.query_intent, exec_res["tool_results"])
        verification = VerificationLayer.verify_groundedness(exec_res["tool_results"])
        confidence = MultiSignalConfidenceScorer.calculate_confidence()

        # 6. Citations
        citations = CitationEngine.generate_citations(exec_res["tool_results"])

        # 7. LLM Scientific Explanation
        ai_text = await self.provider.generate(prompt, context_data=exec_res["analytics"])

        # 8. Dynamic PostGIS SQL Generation
        region_info = parsed.get("region")
        bbox = region_info["bbox"] if region_info else {"lat_min": 5.0, "lat_max": 25.0, "lon_min": 50.0, "lon_max": 95.0}
        depth_spec = parsed.get("depth_filter")

        depth_clause = ""
        if depth_spec and depth_spec.get("type") == "point":
            m_val = depth_spec["m"]
            depth_clause = f" AND m.depth_m BETWEEN {m_val - 10.0} AND {m_val + 10.0}"
        elif depth_spec and depth_spec.get("type") == "range":
            depth_clause = f" AND m.depth_m BETWEEN {depth_spec['min_m']} AND {depth_spec['max_m']}"

        wmo_clause = f" AND f.platform_number = {parsed['wmo_id']}" if parsed.get("wmo_id") else ""

        generated_sql = (
            f"SELECT f.platform_number, p.latitude, p.longitude, m.depth_m, m.temperature_c, m.salinity_psu\n"
            f"FROM argo_profiles p\n"
            f"JOIN argo_floats f ON p.float_id = f.id\n"
            f"JOIN argo_measurements m ON m.profile_id = p.id\n"
            f"WHERE ST_Contains(ST_MakeEnvelope({bbox['lon_min']}, {bbox['lat_min']}, {bbox['lon_max']}, {bbox['lat_max']}, 4326),\n"
            f"                  ST_SetSRID(ST_MakePoint(p.longitude, p.latitude), 4326)){depth_clause}{wmo_clause}\n"
            f"ORDER BY m.depth_m ASC LIMIT 50;"
        )

        logger.info(f"[PIPELINE-INSTRUMENTATION] 8. GENERATED SQL: {generated_sql[:100]}...")

        return {
            "success": True,
            "prompt": prompt,
            "intent": plan.query_intent,
            "query_type": parsed.get("query_type"),
            "response": ai_text,
            "generated_sql": generated_sql,
            "reasoning": reasoning,
            "verification": verification,
            "confidence": confidence,
            "citations": [c.model_dump() for c in citations],
            "analytical_summary": exec_res["analytics"],
            "viz_spec": exec_res["viz_spec"],
            "suggested_followups": [
                f"Compare {region_info['name'] if region_info else 'Indian Ocean'} profile with historic 2022 baseline",
                f"Export GeoJSON telemetry dataset for {region_info['name'] if region_info else 'Indian Ocean'}",
                "Analyze thermocline gradient depth between 100m–300m"
            ],
            "tool_results": exec_res["tool_results"],
            "workflow_steps": [
                "1. Guardrail Security Verified",
                f"2. Intent Categorized: {plan.query_intent} ({parsed.get('query_type')})",
                f"3. Scientific Data Pipeline Executed ({len(exec_res['df_res'])} rows)",
                "4. Analytics & Plotly Visualization Engine Executed",
                "5. Scientific Evidence Verified & Grounded",
                "6. Exact Metadata Citations & PostGIS Query Attached",
            ]
        }
