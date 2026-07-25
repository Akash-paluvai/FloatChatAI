"""Abstract VectorProvider interface."""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Tuple


class VectorProvider(ABC):
    """Abstract vector store provider contract (FAISS, Chroma, Qdrant)."""

    @abstractmethod
    def add_vectors(self, vector_ids: List[str], vectors: List[List[float]], metadata_list: List[Dict[str, Any]]) -> None:
        """Add embedding vectors and metadata items to store."""
        raise NotImplementedError()

    @abstractmethod
    def similarity_search(self, query_vector: List[float], top_k: int = 10) -> List[Tuple[str, float, Dict[str, Any]]]:
        """Perform similarity search and return list of (id, distance_score, metadata)."""
        raise NotImplementedError()

    @abstractmethod
    def get_stats(self) -> Dict[str, Any]:
        """Return vector index statistics."""
        raise NotImplementedError()
