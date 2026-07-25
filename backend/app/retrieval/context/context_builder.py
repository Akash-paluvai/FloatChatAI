"""ContextBuilder assembling retrieved chunks into coherent scientific context blocks for LLM consumption in Phase 6."""
from typing import List, Dict, Any
from pydantic import BaseModel, Field


class AssembledScientificContext(BaseModel):
    query_intent: Dict[str, Any]
    summary_heading: str
    total_retrieved_chunks: int
    context_blocks: List[str]
    retrieved_chunks: List[Dict[str, Any]]


class ContextBuilder:
    """Assembles retrieved chunks, knowledge graph relationships, and measurement data into coherent scientific contexts."""

    @staticmethod
    def build_context(intent: Dict[str, Any], retrieved_chunks: List[Dict[str, Any]]) -> AssembledScientificContext:
        blocks = []

        for idx, chunk in enumerate(retrieved_chunks, start=1):
            text = chunk.get("text_content", "")
            meta = chunk.get("compact_metadata", chunk.get("metadata", {}))
            score = chunk.get("scores", {}).get("rerank_score", chunk.get("hybrid_score", 1.0))

            block = (
                f"[Source #{idx} | Region: {meta.get('ocean_region', 'Unknown')} | Float #{meta.get('platform_id', 'Unknown')} | Score: {score}]\n"
                f"{text}"
            )
            blocks.append(block)

        summary = f"Retrieved {len(retrieved_chunks)} scientific observation contexts matching intent: {intent.get('primary_intent', 'general')}"

        return AssembledScientificContext(
            query_intent=intent,
            summary_heading=summary,
            total_retrieved_chunks=len(retrieved_chunks),
            context_blocks=blocks,
            retrieved_chunks=retrieved_chunks
        )
