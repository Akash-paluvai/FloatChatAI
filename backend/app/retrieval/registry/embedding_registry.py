"""EmbeddingRegistry tracking metadata, dimensions, tokenizers, and metric versions."""
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class EmbeddingModelMetadata(BaseModel):
    model_name: str
    dimension: int
    tokenizer: str
    metric: str = "cosine"  # cosine, inner_product, l2
    is_normalized: bool = True
    version: str


class EmbeddingRegistry:
    """Registry maintaining metadata for all supported embedding models."""

    _REGISTRY: Dict[str, EmbeddingModelMetadata] = {
        "bge-small-v1.5": EmbeddingModelMetadata(
            model_name="BAAI/bge-small-en-v1.5",
            dimension=384,
            tokenizer="BERT",
            metric="cosine",
            is_normalized=True,
            version="bge_v1.5"
        ),
        "e5-small-v2": EmbeddingModelMetadata(
            model_name="intfloat/e5-small-v2",
            dimension=384,
            tokenizer="BERT",
            metric="cosine",
            is_normalized=True,
            version="e5_v2.0"
        ),
        "minilm-l6-v2": EmbeddingModelMetadata(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            dimension=384,
            tokenizer="WordPiece",
            metric="cosine",
            is_normalized=True,
            version="minilm_v2"
        ),
    }

    @classmethod
    def get_metadata(cls, key: str = "bge-small-v1.5") -> EmbeddingModelMetadata:
        return cls._REGISTRY.get(key, cls._REGISTRY["bge-small-v1.5"])
