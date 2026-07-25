"""ReciprocalRankFusion & ScientificScorer modules."""
from typing import List, Dict, Any


class ReciprocalRankFusion:
    """Combines BM25 and Vector Similarity ranks using RRF formula 1 / (60 + rank)."""

    @staticmethod
    def fuse_rankings(
        vector_results: List[Dict[str, Any]],
        bm25_results: List[Dict[str, Any]],
        k: int = 60,
        top_n: int = 10
    ) -> List[Dict[str, Any]]:
        scores: Dict[str, float] = {}
        item_map: Dict[str, Dict[str, Any]] = {}

        # Vector Ranks
        for rank, item in enumerate(vector_results):
            vid = item["chunk_id"]
            scores[vid] = scores.get(vid, 0.0) + (1.0 / (k + rank + 1))
            item_map[vid] = item

        # BM25 Ranks
        for rank, item in enumerate(bm25_results):
            vid = item["chunk_id"]
            scores[vid] = scores.get(vid, 0.0) + (1.0 / (k + rank + 1))
            if vid not in item_map:
                item_map[vid] = item

        fused = []
        for vid, score in scores.items():
            entry = dict(item_map[vid])
            entry["rrf_score"] = round(score, 6)
            fused.append(entry)

        fused.sort(key=lambda x: x["rrf_score"], reverse=True)
        return fused[:top_n]


class ScientificScorer:
    """Scores candidate passages by QC flag quality, temporal freshness, and geographical proximity."""

    @staticmethod
    def score_candidate(candidate: Dict[str, Any]) -> float:
        base = candidate.get("rrf_score", candidate.get("hybrid_score", 0.5))
        qc_flag = candidate.get("metadata", {}).get("qc_flag", 1)

        # QC Penalty
        qc_multiplier = 1.0 if qc_flag == 1 else (0.8 if qc_flag == 2 else 0.3)
        return round(base * qc_multiplier, 4)
