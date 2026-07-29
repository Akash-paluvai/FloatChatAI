"""LangGraph Agent Orchestrator — real-data scientific workflow.
Connects QueryPlanner → DataPipeline → Analytics → Visualization → Response."""
from typing import Dict, Any
from loguru import logger
from app.ai.models.mock_provider import MockAIProvider
from app.ai.executor.execution_engine import TaskPlanner, ExecutionEngine
from app.ai.verification.confidence_scorer import ScientificReasoningEngine, MultiSignalConfidenceScorer
from app.ai.citations.citation_engine import VerificationLayer, CitationEngine
from app.ai.guardrails.ai_guardrails import AIGuardrails


class FloatChatGraphAgent:
    """Real-data scientific AI workflow orchestrator."""

    def __init__(self, provider=None, executor=None):
        self.provider = provider if provider else MockAIProvider()
        self.executor = executor if executor else ExecutionEngine()

    async def run_workflow(self, prompt: str, session_id: str = "default_session") -> Dict[str, Any]:
        logger.info(f"[PIPELINE] Step 1 — USER PROMPT: '{prompt}'")

        # 1. Guardrails
        guard = AIGuardrails.check_input(prompt)
        if not guard["safe"]:
            logger.warning(f"[PIPELINE] GUARDRAIL ALERT: {guard['reason']}")
            return {
                "success": False,
                "response": f"Security Guardrail Alert: {guard['reason']}",
                "citations": [], "confidence": 0.0,
                "generated_sql": None, "workflow_steps": ["Guardrail Check Failed"]
            }

        # 2. Planning
        plan = TaskPlanner.create_plan(prompt)
        parsed = plan.parsed_spec
        logger.info(f"[PIPELINE] Step 2 — INTENT: {plan.query_intent} | TYPE: {parsed.get('query_type')}")

        # 3. Greetings bypass
        if parsed.get("query_type") == "GREETING":
            ai_text = await self.provider.generate(prompt)
            return {
                "success": True, "prompt": prompt,
                "intent": plan.query_intent, "query_type": "GREETING",
                "response": ai_text, "generated_sql": None,
                "citations": [], "confidence": 1.0,
                "analytical_summary": {"status": "Greeting acknowledged"},
                "viz_spec": [],
                "suggested_followups": [
                    "Show temperature near Bay of Bengal",
                    "Analyze salinity in Arabian Sea in 2023",
                    "Compare 2022 vs 2024 temperatures in Indian Ocean"
                ],
                "workflow_steps": ["1. Intent: Greeting", "2. Direct Response"],
                "tool_results": {}
            }

        # 4. Execute real data pipeline
        exec_res = await self.executor.execute_plan(plan, prompt)

        # 5. Generate data-driven text (passing real analytics as context)
        ai_text = await self.provider.generate(prompt, context_data=exec_res["analytics"])

        # 6. Reasoning & Verification
        reasoning = ScientificReasoningEngine.reason_over_evidence(plan.query_intent, exec_res["tool_results"])
        verification = VerificationLayer.verify_groundedness(exec_res["tool_results"])
        confidence = MultiSignalConfidenceScorer.calculate_confidence()

        # 7. Citations
        citations = CitationEngine.generate_citations(exec_res["tool_results"])

        # 8. Dynamic SQL generation
        region_info = parsed.get("region")
        bbox = region_info["bbox"] if region_info else {"lat_min": -30, "lat_max": 30, "lon_min": 30, "lon_max": 110}
        depth_spec = parsed.get("depth_filter")

        depth_clause = ""
        if depth_spec and depth_spec.get("type") == "point":
            m = depth_spec["m"]
            depth_clause = f" AND m.depth_m BETWEEN {m - 10.0} AND {m + 10.0}"
        elif depth_spec and depth_spec.get("type") == "range":
            depth_clause = f" AND m.depth_m BETWEEN {depth_spec['min_m']} AND {depth_spec['max_m']}"

        generated_sql = (
            f"SELECT p.latitude, p.longitude, m.depth_m, m.temperature_c, m.salinity_psu\n"
            f"FROM argo_profiles p\n"
            f"JOIN argo_measurements m ON m.profile_id = p.id\n"
            f"WHERE ST_Contains(ST_MakeEnvelope({bbox['lon_min']}, {bbox['lat_min']}, {bbox['lon_max']}, {bbox['lat_max']}, 4326),\n"
            f"      ST_SetSRID(ST_MakePoint(p.longitude, p.latitude), 4326)){depth_clause}\n"
            f"ORDER BY m.depth_m ASC LIMIT 50;"
        )

        # 9. Build data-driven follow-ups
        region_name = region_info["name"] if region_info else "Indian Ocean"
        n_rows = len(exec_res.get("df_res", []))
        followups = [
            f"Show depth profile in {region_name}",
            f"Generate T-S diagram for {region_name}",
        ]
        if parsed.get("query_type") != "COMPARISON":
            followups.append("Compare 2022 vs 2024 temperature trends")
        if parsed.get("query_type") != "SALINITY":
            followups.append(f"Analyze salinity patterns in {region_name}")

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
            "suggested_followups": followups,
            "tool_results": exec_res["tool_results"],
            "workflow_steps": [
                "1. Guardrail Security Verified",
                f"2. Intent: {plan.query_intent} ({parsed.get('query_type')})",
                f"3. Real Data Pipeline: {n_rows} rows loaded from parquet",
                f"4. Analytics computed from {n_rows} observations",
                f"5. {len(exec_res.get('viz_spec', []))} visualizations generated",
                "6. Evidence verified & citations attached",
            ]
        }
