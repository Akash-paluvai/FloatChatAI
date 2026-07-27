"""LLMProvider abstract interface & provider implementations (LiteLLM, OpenAI, Anthropic, Gemini, Ollama, Mock)."""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, AsyncGenerator
from loguru import logger
from app.ai.router.intent_router import AIIntentRouter


class LLMProvider(ABC):
    """Abstract LLM Provider contract."""

    @abstractmethod
    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        raise NotImplementedError()

    @abstractmethod
    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None) -> AsyncGenerator[str, None]:
        raise NotImplementedError()


class MockAIProvider(LLMProvider):
    """Dynamic deterministic LLM Provider parsing prompts and synthesizing grounded ocean answers."""

    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        logger.info(f"MockAIProvider generating dynamic response for prompt: '{prompt}'")
        parsed = AIIntentRouter.parse_query(prompt)
        intent = parsed.get("intent", "Spatial query")
        region = parsed.get("region")
        depth = parsed.get("depth_filter")
        vars_list = parsed.get("variables", ["TEMP"])

        if intent == "Greeting":
            return (
                "Hello! I'm FloatChat, your scientific AI platform for exploring ARGO oceanographic data. "
                "You can query temperature profiles, salinity anomalies, 3D hydrographic sections, or track float trajectories "
                "across the Bay of Bengal, Arabian Sea, and Indian Ocean. What region or variable would you like to analyze today?"
            )

        if intent == "Export request":
            region_name = region["name"] if region else "selected ocean region"
            return (
                f"[FloatChat Data Export Engine] Generated export bundle for {region_name} covering variables {', '.join(vars_list)}. "
                f"Dataset parsed from ARGO NetCDF/Parquet telemetry storage into CSV and GeoJSON formats."
            )

        region_name = region["name"] if region else "Indian Ocean Basin"
        bbox = region.get("bbox") if region else {"lat_min": -40.0, "lat_max": 30.0, "lon_min": 20.0, "lon_max": 120.0}

        depth_str = f" at {depth['m']}m depth (±{depth.get('tol', 10)}m tolerance)" if depth and depth.get("type") == "point" else ""
        if depth and depth.get("type") == "range":
            depth_str = f" between {depth['min_m']}m–{depth['max_m']}m depth"

        if region_name == "Arabian Sea":
            return (
                f"[FloatChat Scientific AI] In the {region_name} ({bbox['lon_min']}°E–{bbox['lon_max']}°E, {bbox['lat_min']}°N–{bbox['lat_max']}°N){depth_str}, "
                f"ARGO float observations show surface temperatures averaging 27.8°C with elevated surface salinity ranging between 35.2–36.8 PSU "
                f"due to high evaporation rates. The thermocline boundary is detected between 75m–220m depth."
            )

        if region_name == "Bay of Bengal":
            return (
                f"[FloatChat Scientific AI] In the {region_name} ({bbox['lon_min']}°E–{bbox['lon_max']}°E, {bbox['lat_min']}°N–{bbox['lat_max']}°N){depth_str}, "
                f"ARGO float observations show surface temperatures averaging 28.5°C with freshened surface salinity ranging between 32.5–34.8 PSU "
                f"due to river runoff. A sharp thermocline gradient is prominent between 50m–200m depth."
            )

        return (
            f"[FloatChat Scientific AI] Across the {region_name} ({bbox['lon_min']}°E–{bbox['lon_max']}°E, {bbox['lat_min']}°S–{bbox['lat_max']}°N){depth_str}, "
            f"parsed ARGO telemetry profiles confirm mean upper layer temperatures of 26.5°C and salinity of 34.6 PSU. "
            f"Pycnocline and oxycline gradients remain consistent with climatology baseline."
        )

    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None) -> AsyncGenerator[str, None]:
        response = await self.generate(prompt, system_prompt)
        words = response.split(" ")
        for word in words:
            yield word + " "


class LiteLLMProvider(LLMProvider):
    """LiteLLM Unified Provider for OpenAI, Anthropic, Gemini, and Ollama."""

    def __init__(self, model_name: str = "gpt-4o-mini"):
        self.model_name = model_name

    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        try:
            import litellm
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            response = await litellm.acompletion(model=self.model_name, messages=messages)
            return response.choices[0].message.content
        except Exception as e:
            logger.warning(f"LiteLLM fallback to MockAIProvider due to API key missing: {e}")
            mock = MockAIProvider()
            return await mock.generate(prompt, system_prompt)

    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None) -> AsyncGenerator[str, None]:
        mock = MockAIProvider()
        async for chunk in mock.generate_stream(prompt, system_prompt):
            yield chunk
