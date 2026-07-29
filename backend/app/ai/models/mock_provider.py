"""LLMProvider abstract interface & DataDrivenAIProvider that generates explanations from real analytics."""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, AsyncGenerator
from loguru import logger


class LLMProvider(ABC):
    """Abstract LLM Provider contract."""

    @abstractmethod
    async def generate(self, prompt: str, system_prompt: Optional[str] = None, context_data: Optional[Dict[str, Any]] = None) -> str:
        raise NotImplementedError()

    @abstractmethod
    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None) -> AsyncGenerator[str, None]:
        raise NotImplementedError()


class MockAIProvider(LLMProvider):
    """Data-driven scientific explanation generator.
    Uses REAL analytics context_data to build responses — no hardcoded numbers."""

    async def generate(self, prompt: str, system_prompt: Optional[str] = None, context_data: Optional[Dict[str, Any]] = None) -> str:
        logger.info(f"[LLM-SYNTHESIZER] Generating data-driven explanation for: '{prompt}'")

        # If no context data, we can't generate a real response
        if not context_data:
            return self._generate_greeting_or_fallback(prompt)

        return self._synthesize_from_data(prompt, context_data)

    def _generate_greeting_or_fallback(self, prompt: str) -> str:
        """Handle greetings and queries without data context."""
        txt = prompt.lower().strip()
        greetings = ["hello", "hi", "hey", "good morning", "good evening", "help", "what can you do"]
        if any(txt.startswith(g) for g in greetings):
            return (
                "Hello! I'm FloatChat, your AI-powered oceanographic data explorer. "
                "I analyze real ARGO float observations across the Indian Ocean, Bay of Bengal, "
                "Arabian Sea, and more. Ask me about:\n\n"
                "- **Temperature profiles**: \"Show temperature near Bay of Bengal at 500m\"\n"
                "- **Salinity analysis**: \"Analyze salinity in Arabian Sea in 2023\"\n"
                "- **Multi-year comparisons**: \"Compare 2022 vs 2024 temperatures\"\n"
                "- **Spatial distributions**: \"Map temperature across Indian Ocean\"\n\n"
                "What would you like to explore?"
            )
        return "I couldn't find relevant data for your query. Try asking about temperature, salinity, or ARGO float observations in a specific ocean region."

    def _synthesize_from_data(self, prompt: str, data: Dict[str, Any]) -> str:
        """Build a scientific explanation from REAL computed analytics — no hardcoded values."""
        parts = []

        # Check if it's a comparison result
        if "years_compared" in data:
            return self._format_comparison(data)

        # Check if it's a salinity result
        if "mean_salinity" in data:
            return self._format_salinity(data)

        # Default: temperature/general stats
        region = data.get("region_name", "the queried region")
        n_obs = data.get("total_observations", 0)

        if n_obs == 0:
            return f"No observations were found matching your query in {region}. Try broadening your search — for example, expand the time range or depth window."

        parts.append(f"**{region.title()} Analysis** — Based on {n_obs:,} real ARGO float observations:")

        if data.get("avg_temp"):
            parts.append(f"- **Temperature**: Mean {data['avg_temp']}, range {data.get('min_temp', 'N/A')} – {data.get('max_temp', 'N/A')} (σ = {data.get('std_temp', 'N/A')})")

        if data.get("salinity_range"):
            parts.append(f"- **Salinity**: {data['salinity_range']} (mean {data.get('avg_salinity', 'N/A')})")

        if data.get("depth_range"):
            parts.append(f"- **Depth coverage**: {data['depth_range']}")

        if data.get("time_range"):
            parts.append(f"- **Time period**: {data['time_range']}")

        if data.get("spatial_centroid"):
            parts.append(f"- **Spatial centroid**: {data['spatial_centroid']}")

        if data.get("thermocline_gradient_depth"):
            parts.append(f"- **Thermocline zone**: {data['thermocline_gradient_depth']}")

        if data.get("unique_profiles"):
            parts.append(f"- **Unique float profiles**: {data['unique_profiles']}")

        if data.get("cited_source_files"):
            files = data["cited_source_files"][:5]
            parts.append(f"- **Data sources**: {', '.join(files)}")

        return "\n".join(parts)

    def _format_comparison(self, data: Dict[str, Any]) -> str:
        """Format multi-year comparison from real computed deltas."""
        years = data.get("years_compared", [])
        variable = data.get("variable", "TEMP")
        unit = "°C" if variable == "TEMP" else "PSU"
        summaries = data.get("yearly_summaries", {})
        delta = data.get("overall_delta", "N/A")
        trend = data.get("trend_direction", "Unknown")

        parts = [f"**Multi-Year {variable} Comparison ({' vs '.join(str(y) for y in years)})**\n"]

        for yr, s in sorted(summaries.items()):
            if s.get("mean_val") is not None:
                parts.append(f"- **{yr}**: Mean = {s['mean_val']}{unit}, Range = {s.get('min_val', 'N/A')} – {s.get('max_val', 'N/A')}{unit}, n = {s.get('obs_count', 0):,} observations")
            else:
                parts.append(f"- **{yr}**: {s.get('note', 'No data')}")

        parts.append(f"\n**Overall change**: {delta} ({trend})")
        return "\n".join(parts)

    def _format_salinity(self, data: Dict[str, Any]) -> str:
        """Format salinity analysis from real computed stats."""
        region = data.get("region_name", "")
        parts = [f"**Salinity Analysis — {region.title()}**\n"]
        parts.append(f"- **Mean salinity**: {data.get('mean_salinity', 'N/A')}")
        parts.append(f"- **Range**: {data.get('salinity_range', 'N/A')}")
        parts.append(f"- **Std deviation**: {data.get('std_salinity', 'N/A')}")
        parts.append(f"- **Observations**: {data.get('total_observations', 0):,}")
        parts.append(f"- **Regime**: {data.get('regime', 'N/A')}")

        if data.get("mean_temp"):
            parts.append(f"- **Mean temperature**: {data['mean_temp']}")
        if data.get("ts_correlation"):
            parts.append(f"- **T-S Correlation**: {data['ts_correlation']}")

        return "\n".join(parts)

    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None) -> AsyncGenerator[str, None]:
        response = await self.generate(prompt, system_prompt)
        words = response.split(" ")
        for word in words:
            yield word + " "


class LiteLLMProvider(LLMProvider):
    """LiteLLM Unified Provider for OpenAI, Anthropic, Gemini, and Ollama."""

    def __init__(self, model_name: str = "gpt-4o-mini"):
        self.model_name = model_name

    async def generate(self, prompt: str, system_prompt: Optional[str] = None, context_data: Optional[Dict[str, Any]] = None) -> str:
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
            return await mock.generate(prompt, system_prompt, context_data)

    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None) -> AsyncGenerator[str, None]:
        mock = MockAIProvider()
        async for chunk in mock.generate_stream(prompt, system_prompt):
            yield chunk
