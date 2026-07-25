"""ChatService implementation returning placeholder responses."""
from app.schemas.chat import ChatRequest, ChatResponse, AnalyticalSummary


class ChatService:
    """Business service for natural language ocean querying."""

    async def process_chat(self, request: ChatRequest) -> ChatResponse:
        """Process chat prompt (Placeholder for Phase 6 RAG / LangChain AI engine)."""
        return ChatResponse(
            status="Phase 3 AI Integration Pending",
            response_text=f"[Demo Preview] FloatChat backend received prompt: '{request.message}'. Processed via mock query engine.",
            sql_query_preview=f"SELECT depth_m, temp_celsius, salinity_psu FROM argo_profiles WHERE ocean_region = '{request.ocean_region or 'Bay of Bengal'}' LIMIT 1000;",
            analytical_summary=AnalyticalSummary(
                avg_temp="28.3°C (Surface)",
                max_depth=f"{request.max_depth_m:,.0f} meters",
                salinity_range="33.2 – 35.0 PSU",
                anomaly_detected=False
            ),
            suggested_followups=[
                "Compare temperature profile with 2022 historic baseline",
                "Download GeoJSON dataset for these floats",
                "Analyze thermocline gradient depth between 100m–300m"
            ]
        )
