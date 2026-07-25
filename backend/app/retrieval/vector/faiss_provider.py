"""FAISSProvider using FAISS L2/Cosine index for vector similarity search."""
from typing import List, Dict, Any, Tuple
import numpy as np
import faiss
from loguru import logger
from app.retrieval.vector.vector_provider import VectorProvider


class FAISSProvider(VectorProvider):
    """FAISS-backed vector database provider."""

    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.index = faiss.IndexFlatIP(dimension)  # Inner Product (Cosine on normalized vectors)
        self.id_to_meta: Dict[int, Tuple[str, Dict[str, Any]]] = {}
        self.counter = 0

    def add_vectors(self, vector_ids: List[str], vectors: List[List[float]], metadata_list: List[Dict[str, Any]]) -> None:
        if not vectors:
            return

        arr = np.array(vectors, dtype=np.float32)
        # Normalize for Cosine Similarity
        faiss.normalize_L2(arr)
        self.index.add(arr)

        for vid, meta in zip(vector_ids, metadata_list):
            self.id_to_meta[self.counter] = (vid, meta)
            self.counter += 1

        logger.info(f"FAISSProvider indexed {len(vectors)} vectors. Total: {self.index.ntotal}")

    def similarity_search(self, query_vector: List[float], top_k: int = 10) -> List[Tuple[str, float, Dict[str, Any]]]:
        if self.index.ntotal == 0:
            return []

        q = np.array([query_vector], dtype=np.float32)
        faiss.normalize_L2(q)

        scores, indices = self.index.search(q, min(top_k, self.index.ntotal))
        results = []

        for score, idx in zip(scores[0], indices[0]):
            if idx in self.id_to_meta:
                vid, meta = self.id_to_meta[idx]
                results.append((vid, float(score), meta))

        return results

    def get_stats(self) -> Dict[str, Any]:
        return {
            "provider": "FAISS",
            "dimension": self.dimension,
            "total_vectors": self.index.ntotal,
            "metric": "Cosine Similarity (Inner Product)"
        }
