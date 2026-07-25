"""ChromaProvider using ChromaDB vector database."""
from typing import List, Dict, Any, Tuple
import chromadb
from loguru import logger
from app.retrieval.vector.vector_provider import VectorProvider


class ChromaProvider(VectorProvider):
    """ChromaDB-backed vector database provider."""

    def __init__(self, collection_name: str = "floatchat_ocean"):
        self.client = chromadb.Client()
        self.collection = self.client.get_or_create_collection(name=collection_name)

    def add_vectors(self, vector_ids: List[str], vectors: List[List[float]], metadata_list: List[Dict[str, Any]]) -> None:
        if not vectors:
            return

        documents = [meta.get("text_content", f"Chunk {vid}") for vid, meta in zip(vector_ids, metadata_list)]
        clean_metas = [{k: str(v) for k, v in meta.items() if isinstance(v, (str, int, float, bool))} for meta in metadata_list]

        self.collection.add(
            ids=vector_ids,
            embeddings=vectors,
            metadatas=clean_metas,
            documents=documents
        )
        logger.info(f"ChromaProvider indexed {len(vectors)} items into collection '{self.collection.name}'")

    def similarity_search(self, query_vector: List[float], top_k: int = 10) -> List[Tuple[str, float, Dict[str, Any]]]:
        if self.collection.count() == 0:
            return []

        res = self.collection.query(
            query_embeddings=[query_vector],
            n_results=min(top_k, self.collection.count())
        )

        results = []
        if res and "ids" in res and res["ids"]:
            ids = res["ids"][0]
            distances = res["distances"][0] if "distances" in res else [1.0] * len(ids)
            metadatas = res["metadatas"][0] if "metadatas" in res else [{}] * len(ids)

            for vid, dist, meta in zip(ids, distances, metadatas):
                # Convert distance to similarity score
                similarity = round(max(0.0, 1.0 - (dist / 2.0)), 4)
                results.append((vid, similarity, meta))

        return results

    def get_stats(self) -> Dict[str, Any]:
        return {
            "provider": "ChromaDB",
            "collection_name": self.collection.name,
            "total_vectors": self.collection.count(),
        }
