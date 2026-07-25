"""HybridSearchEngine & HierarchicalRetriever combining BM25 + Vector Similarity + Filters."""
from typing import List, Dict, Any, Tuple
from rank_bm25 import BM25Okapi
from app.retrieval.vector.faiss_provider import FAISSProvider
from app.retrieval.embeddings.embedding_manager import EmbeddingManager
from app.retrieval.filters.metadata_filter import MetadataFilterEngine


class HybridSearchEngine:
    """Combines BM25 lexical keyword search + Vector similarity search + Metadata filters."""

    def __init__(self, vector_store: FAISSProvider = None):
        self.vector_store = vector_store if vector_store else FAISSProvider()
        self.embedding_mgr = EmbeddingManager()
        self.documents: List[Dict[str, Any]] = []
        self.bm25_corpus: List[List[str]] = []
        self.bm25_index = None

    def add_documents(self, docs: List[Dict[str, Any]]) -> None:
        if not docs:
            return

        vector_ids = [d["chunk_id"] for d in docs]
        texts = [d["text_content"] for d in docs]
        vectors = self.embedding_mgr.generate_batch(texts)

        self.vector_store.add_vectors(vector_ids, vectors, docs)
        self.documents.extend(docs)

        # Build BM25 Index
        tokenized_corpus = [t.lower().split() for t in texts]
        self.bm25_corpus.extend(tokenized_corpus)
        self.bm25_index = BM25Okapi(self.bm25_corpus)

    def hybrid_search(
        self,
        query_text: str,
        filter_params: Dict[str, Any] = None,
        top_k: int = 10,
        alpha: float = 0.5
    ) -> List[Dict[str, Any]]:
        if not self.documents:
            return []

        query_vec = self.embedding_mgr.generate_embedding(query_text)
        vector_results = self.vector_store.similarity_search(query_vec, top_k=top_k * 2)

        # Map vector scores
        vector_score_map = {vid: score for vid, score, _ in vector_results}

        # Compute BM25 scores
        tokenized_query = query_text.lower().split()
        bm25_scores = self.bm25_index.get_scores(tokenized_query) if self.bm25_index else [0.0] * len(self.documents)

        candidates = []
        for i, doc in enumerate(self.documents):
            vid = doc["chunk_id"]

            # Filter check
            if filter_params and not MetadataFilterEngine.matches_filters(doc.get("metadata", {}), filter_params):
                continue

            v_score = vector_score_map.get(vid, 0.0)
            b_score = float(bm25_scores[i]) if i < len(bm25_scores) else 0.0

            # Normalized Hybrid Score
            hybrid_score = round((alpha * v_score) + ((1 - alpha) * min(1.0, b_score / 10.0)), 4)

            candidates.append({
                "chunk_id": vid,
                "text_content": doc["text_content"],
                "metadata": doc.get("metadata", {}),
                "lineage": doc.get("lineage", {}),
                "vector_score": round(v_score, 4),
                "bm25_score": round(b_score, 4),
                "hybrid_score": hybrid_score
            })

        candidates.sort(key=lambda x: x["hybrid_score"], reverse=True)
        return candidates[:top_k]


class HierarchicalRetriever:
    """Multi-level search traversal: Query -> Relevant Datasets -> Relevant Profiles -> Relevant Measurements."""

    def __init__(self, hybrid_engine: HybridSearchEngine):
        self.hybrid_engine = hybrid_engine

    def hierarchical_search(self, query_text: str, top_k: int = 5) -> Dict[str, List[Dict[str, Any]]]:
        all_results = self.hybrid_engine.hybrid_search(query_text, top_k=top_k * 3)

        datasets = [r for r in all_results if r.get("metadata", {}).get("chunk_type") == "dataset"]
        profiles = [r for r in all_results if r.get("metadata", {}).get("chunk_type") != "dataset"]

        return {
            "top_datasets": datasets[:2],
            "top_profiles": profiles[:top_k],
        }
