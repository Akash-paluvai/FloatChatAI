"""Abstract BaseEmbeddingModel interface and Concrete Embedding Model implementations."""
from abc import ABC, abstractmethod
from typing import List
import numpy as np
from loguru import logger
from app.retrieval.registry.embedding_registry import EmbeddingRegistry, EmbeddingModelMetadata


class BaseEmbeddingModel(ABC):
    """Abstract contract for text embedding models."""

    def __init__(self, key: str):
        self.metadata: EmbeddingModelMetadata = EmbeddingRegistry.get_metadata(key)

    @abstractmethod
    def embed_text(self, text: str) -> List[float]:
        """Embed a single text string into float vector."""
        raise NotImplementedError()

    @abstractmethod
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of text strings into float vectors."""
        raise NotImplementedError()


class MockEmbeddingModel(BaseEmbeddingModel):
    """Fast deterministic embedding model for testing and offline execution."""

    def __init__(self, key: str = "bge-small-v1.5"):
        super().__init__(key)

    def embed_text(self, text: str) -> List[float]:
        # Deterministic float vector based on text hash
        np.random.seed(abs(hash(text)) % (2**32))
        vec = np.random.randn(self.metadata.dimension).astype(np.float32)
        norm = np.linalg.norm(vec)
        return (vec / norm if norm > 0 else vec).tolist()

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.embed_text(t) for t in texts]


class BGEEmbeddingModel(MockEmbeddingModel):
    def __init__(self):
        super().__init__("bge-small-v1.5")


class E5EmbeddingModel(MockEmbeddingModel):
    def __init__(self):
        super().__init__("e5-small-v2")


class MiniLMEmbeddingModel(MockEmbeddingModel):
    def __init__(self):
        super().__init__("minilm-l6-v2")
