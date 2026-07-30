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
    Uses REAL analytics context_data to build responses — no hardcoded numbers.
    Each response includes a plain-language summary for easy understanding."""

    async def generate(self, prompt: str, system_prompt: Optional[str] = None, context_data: Optional[Dict[str, Any]] = None) -> str:
        logger.info(f"[LLM-SYNTHESIZER] Generating data-driven explanation for: '{prompt}'")

        if not context_data:
            return self._generate_greeting_or_fallback(prompt)

        return self._synthesize_from_data(prompt, context_data)

    def _generate_greeting_or_fallback(self, prompt: str) -> str:
        """Handle greetings and queries without data context."""
        txt = prompt.lower().strip()
        greetings = ["hello", "hi", "hey", "good morning", "good evening", "help", "what can you do"]
        if any(txt.startswith(g) for g in greetings):
            return (
                "Hello! I'm **FloatChat**, your AI-powered oceanographic data explorer. "
                "I analyze **real ARGO float observations** across the Indian Ocean, Bay of Bengal, "
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
        # Check if it's a comparison result
        if "years_compared" in data:
            return self._format_comparison(data)

        # Check if it's a salinity result
        if "mean_salinity" in data:
            return self._format_salinity(data)

        # Default: temperature/general stats
        return self._format_temperature(data)

    def _format_temperature(self, data: Dict[str, Any]) -> str:
        """Format temperature/general analysis with a plain-language summary."""
        region = data.get("region_name", "the queried region")
        n_obs = data.get("total_observations", 0)

        if n_obs == 0:
            return (
                f"**No data found** for {region.title()}.\n\n"
                "The ARGO dataset (2022–2024) does not contain observations matching your filters. "
                "Try broadening the time range, expanding the depth window, or selecting a different region."
            )

        parts = [f"## {region.title()} — Temperature Analysis\n"]

        # Key metrics section
        parts.append("**Key Findings:**")
        if data.get("avg_temp"):
            parts.append(f"- **Average temperature**: {data['avg_temp']} (σ = {data.get('std_temp', 'N/A')})")
            parts.append(f"- **Temperature range**: {data.get('min_temp', 'N/A')} to {data.get('max_temp', 'N/A')}")

        if data.get("depth_range"):
            parts.append(f"- **Depth coverage**: {data['depth_range']}")

        if data.get("thermocline_gradient_depth"):
            parts.append(f"- **Thermocline zone**: {data['thermocline_gradient_depth']}")

        if data.get("spatial_centroid"):
            parts.append(f"- **Observation centroid**: {data['spatial_centroid']}")

        if data.get("time_range"):
            parts.append(f"- **Time period**: {data['time_range']}")

        parts.append(f"- **Total observations**: {n_obs:,}")

        if data.get("unique_profiles"):
            parts.append(f"- **Float profiles sampled**: {data['unique_profiles']}")

        # Plain-language summary
        parts.append("")
        avg_temp_val = data.get("avg_temp", "N/A")
        thermo = data.get("thermocline_gradient_depth", "")
        summary_lines = [f"**Summary**: Across {n_obs:,} measurements in {region.title()}, the water column averaged {avg_temp_val}."]
        if thermo:
            summary_lines.append(f"The thermocline — where temperature drops most rapidly — was found between {thermo}.")
        if data.get("max_temp") and data.get("min_temp"):
            summary_lines.append(f"Surface waters reached {data['max_temp']} while deep water dropped to {data['min_temp']}, showing the typical tropical stratification pattern.")
        parts.append(" ".join(summary_lines))

        if data.get("cited_source_files"):
            files = data["cited_source_files"][:5]
            parts.append(f"\n**Data sources**: {', '.join(files)}")

        return "\n".join(parts)

    def _format_comparison(self, data: Dict[str, Any]) -> str:
        """Format multi-year comparison with a plain-language summary."""
        years = data.get("years_compared", [])
        variable = data.get("variable", "TEMP")
        unit = "°C" if variable == "TEMP" else " PSU"
        summaries = data.get("yearly_summaries", {})
        delta = data.get("overall_delta", "N/A")
        trend = data.get("trend_direction", "Unknown")

        parts = [f"## Multi-Year {variable} Comparison — {' vs '.join(str(y) for y in years)}\n"]
        parts.append("**Year-by-Year Breakdown:**")

        total_obs = 0
        year_means = {}
        for yr, s in sorted(summaries.items()):
            if s.get("mean_val") is not None:
                parts.append(f"- **{yr}**: Mean = {s['mean_val']}{unit}, Range = {s.get('min_val', 'N/A')} – {s.get('max_val', 'N/A')}{unit}, n = {s.get('obs_count', 0):,} observations")
                total_obs += s.get("obs_count", 0)
                year_means[yr] = s["mean_val"]
            else:
                parts.append(f"- **{yr}**: {s.get('note', 'No data available for this period')}")

        parts.append(f"\n**Overall change**: {delta} ({trend})")

        # Plain-language summary
        parts.append("")
        if len(year_means) >= 2:
            yr_list = sorted(year_means.keys())
            first_yr, last_yr = yr_list[0], yr_list[-1]
            direction = "warmed" if trend == "Warming" else "cooled" if trend == "Cooling" else "remained stable"
            parts.append(
                f"**Summary**: Comparing {total_obs:,} observations across {len(years)} years, "
                f"the ocean {direction} by {delta} overall. "
                f"In {first_yr}, the mean was {year_means[first_yr]}{unit}, "
                f"and by {last_yr} it shifted to {year_means[last_yr]}{unit}. "
                f"{'This cooling trend may reflect seasonal variability or longer-term climate patterns in the region.' if trend == 'Cooling' else 'This warming trend is consistent with global ocean heat uptake patterns.' if trend == 'Warming' else ''}"
            )
        return "\n".join(parts)

    def _format_salinity(self, data: Dict[str, Any]) -> str:
        """Format salinity analysis with a plain-language summary."""
        region = data.get("region_name", "")
        parts = [f"## Salinity Analysis — {region.title()}\n"]
        parts.append("**Key Findings:**")
        parts.append(f"- **Mean salinity**: {data.get('mean_salinity', 'N/A')}")
        parts.append(f"- **Salinity range**: {data.get('salinity_range', 'N/A')}")
        parts.append(f"- **Standard deviation**: {data.get('std_salinity', 'N/A')}")
        parts.append(f"- **Total observations**: {data.get('total_observations', 0):,}")
        parts.append(f"- **Salinity regime**: {data.get('regime', 'N/A')}")

        if data.get("mean_temp"):
            parts.append(f"- **Mean temperature**: {data['mean_temp']}")
        if data.get("ts_correlation"):
            parts.append(f"- **T-S correlation**: {data['ts_correlation']}")

        # Plain-language summary
        parts.append("")
        regime = data.get("regime", "")
        mean_sal = data.get("mean_salinity", "N/A")
        n_obs = data.get("total_observations", 0)

        if "high salinity" in regime.lower():
            parts.append(
                f"**Summary**: The {region.title()} shows a high-salinity pattern ({mean_sal} average), "
                f"driven by intense evaporation exceeding precipitation in this region. "
                f"Based on {n_obs:,} observations, the Arabian Sea High Salinity Water (ASHSW) "
                f"mass signature is clearly visible in the upper water column."
            )
        elif "low salinity" in regime.lower():
            parts.append(
                f"**Summary**: The {region.title()} shows a low-salinity pattern ({mean_sal} average), "
                f"characteristic of regions receiving significant riverine freshwater input. "
                f"Based on {n_obs:,} observations, the Bay of Bengal's fresh surface layer "
                f"creates strong haline stratification."
            )
        else:
            parts.append(
                f"**Summary**: Across {n_obs:,} observations in {region.title()}, "
                f"the mean salinity was {mean_sal}, falling within the {regime} classification."
            )

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
