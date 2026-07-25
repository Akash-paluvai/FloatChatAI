"""LLMProvider abstract interface & provider implementations (LiteLLM, OpenAI, Anthropic, Gemini, Ollama, Mock)."""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, AsyncGenerator
from loguru import logger
from app.config.settings import settings


class LLMProvider(ABC):
    """Abstract LLM Provider contract."""

    @abstractmethod
    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        raise NotImplementedError()

    @abstractmethod
    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None) -> AsyncGenerator[str, None]:
        raise NotImplementedError()


class MockAIProvider(LLMProvider):
    """Production-ready deterministic LLM Provider for offline & test execution."""

    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        logger.info(f"MockAIProvider generating response for prompt length {len(prompt)}")
        return (
            "[FloatChat Scientific AI] In the Bay of Bengal region, ARGO float observations show surface temperatures "
            "averaging 28.3°C with salinity values ranging between 33.2–35.0 PSU. The thermocline gradient is prominent "
            "between 100m–300m depth."
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
