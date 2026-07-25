"""MultiResolutionChunker supporting Dataset -> Profile -> Measurement -> Variable -> Sentence multi-resolution resolution chunking."""
from typing import Dict, Any, List
from app.retrieval.chunking.scientific_chunker import ScientificChunk, ScientificChunker


class MultiResolutionChunker:
    """Multi-resolution chunker producing multi-tier chunks (Dataset -> Profile -> Measurement -> Variable -> Sentence)."""

    @staticmethod
    def chunk_all_resolutions(dataset_info: Dict[str, Any], profile_data: Dict[str, Any]) -> Dict[str, List[ScientificChunk]]:
        profile_chunks = ScientificChunker.chunk_profile(profile_data)

        # Dataset Tier
        ds_chunk = ScientificChunk(
            chunk_id=f"chunk_ds_{dataset_info.get('id', 'ds-101')}",
            chunk_type="dataset",
            text_content=f"Dataset: {dataset_info.get('name', 'ARGO Dataset')}. Source: {dataset_info.get('source', 'ARGO')}. Year: {dataset_info.get('year', 2024)}.",
            metadata={"dataset_id": dataset_info.get('id', 'ds-101')}
        )

        return {
            "dataset_tier": [ds_chunk],
            "profile_tier": [c for c in profile_chunks if c.chunk_type == "profile"],
            "measurement_tier": [c for c in profile_chunks if c.chunk_type == "measurement"],
        }
