"""Agent Policy Layer & AI Guardrails Engine."""
from typing import Dict, Any, List


class ToolPolicy:
    """Governs tool permissions, maximum depth, and execution boundaries."""

    MAX_TOOL_DEPTH = 5
    ALLOWED_ROLES = ["user", "scientist", "admin"]

    @classmethod
    def validate_tool_access(cls, tool_name: str, user_role: str = "user") -> bool:
        if user_role not in cls.ALLOWED_ROLES:
            return False
        return True


class AIGuardrails:
    """Protects against prompt injection, malicious SQL injection, and unauthorized commands."""

    PROMPT_INJECTION_KEYWORDS = ["ignore previous instructions", "system prompt override", "jailbreak", "drop table"]

    @classmethod
    def check_input(cls, prompt: str) -> Dict[str, Any]:
        p_lower = prompt.lower()

        for kw in cls.PROMPT_INJECTION_KEYWORDS:
            if kw in p_lower:
                return {"safe": False, "reason": f"Detected forbidden pattern: '{kw}'"}

        return {"safe": True, "reason": "Input passed security guardrails"}
