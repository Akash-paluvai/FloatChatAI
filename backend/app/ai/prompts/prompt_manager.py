"""Versioned Prompt Template Manager."""
from typing import Dict, Any


class PromptManager:
    """Manages versioned prompts for scientific reasoning, task planning, and citations."""

    SYSTEM_PROMPT_V1 = (
        "You are FloatChat AI, a Senior Oceanographic AI Assistant and Data Scientist. "
        "You analyze ARGO ocean data, thermocline profiles, and temperature/salinity observations. "
        "Every scientific statement MUST be grounded in retrieved datasets and cited with Float WMO ID and profile metadata. "
        "Never invent ocean measurements or extrapolate beyond verified evidence."
    )

    PLANNER_PROMPT_V1 = (
        "Analyze the user query intent and decompose it into an execution plan. "
        "Identify candidate MCP tools, dependencies, and parameters."
    )

    VERIFICATION_PROMPT_V1 = (
        "Verify that the candidate response is strictly grounded in retrieved evidence. "
        "Confirm that QC flags are valid and sources agree."
    )

    @classmethod
    def get_system_prompt(cls) -> str:
        return cls.SYSTEM_PROMPT_V1

    @classmethod
    def get_planner_prompt(cls) -> str:
        return cls.PLANNER_PROMPT_V1

    @classmethod
    def get_verification_prompt(cls) -> str:
        return cls.VERIFICATION_PROMPT_V1
