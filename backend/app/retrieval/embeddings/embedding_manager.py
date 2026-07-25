"""EmbeddingManager for managing model instances and embedding generation."""
from typing import List, Dict, Any
from app.retrieval.embeddings.bge_model import BGEEmbeddingModel, BaseEmbeddingModel


class EmbeddingManager:
    """Managed embedding generator with model caching."""

    def __init__(self, default_model: BaseEmbeddingModel = None):
        self.model = default_model if default_model else BGEEmbeddingModel()

    def generate_embedding(self, text: str) -> List[float]:
        return self.model.embed_text(text)

    def generate_batch(self, texts: List[str]) -> List[List[float]]:
        return self.model.embed_batch(texts)
