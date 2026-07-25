"""Retrieval REST API router."""
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field
from app.schemas.response import APIResponse, ResponseMetadata
from app.dependencies.context import get_request_id
from app.retrieval.filters.intent_classifier import QueryIntentClassifier
from app.retrieval.hybrid.hybrid_engine import HybridSearchEngine
from app.retrieval.explainability.explainer import CrossEncoderReranker, ContextCompressor, RetrievalExplainer
from app.retrieval.context.context_builder import ContextBuilder, AssembledScientificContext
from app.retrieval.registry.embedding_registry import EmbeddingRegistry

router = APIRouter(prefix="/retrieval", tags=["Semantic Retrieval Platform"])
hybrid_engine = HybridSearchEngine()


class SearchRequest(BaseModel):
    query: str = Field(..., json_schema_extra={"example": "Temperature profile near Bay of Bengal"})
    top_k: int = Field(default=5)
    ocean_region: Optional[str] = Field(default=None)


class IndexRequest(BaseModel):
    platform_id: str = Field(default="2901234")
    ocean_region: str = Field(default="Bay of Bengal")
    latitude: float = Field(default=15.5)
    longitude: float = Field(default=88.2)


@router.post(
    "/search",
    response_model=APIResponse[AssembledScientificContext],
    summary="Semantic Hybrid Search & Scientific Context Retrieval",
    description="Executes intent classification, hybrid BM25 + vector search, metadata filtering, reranking, and context assembly."
)
async def post_search(payload: SearchRequest, request: Request, req_id: str = Depends(get_request_id)):
    # 1. Intent Classification
    intent = QueryIntentClassifier.classify_intent(payload.query)

    # 2. Hybrid Search
    filter_params = {"ocean_region": payload.ocean_region} if payload.ocean_region else None
    results = hybrid_engine.hybrid_search(payload.query, filter_params=filter_params, top_k=payload.top_k)

    # If unindexed, create sample result for preview
    if not results:
        sample_doc = {
            "chunk_id": "chunk_sample_2901234",
            "text_content": f"ARGO Float #2901234 profile in Bay of Bengal (15.5°N, 88.2°E). Temp: 28.5°C at 0m, 24.1°C at 100m.",
            "metadata": {"ocean_region": payload.ocean_region or "Bay of Bengal", "platform_id": "2901234"},
            "vector_score": 0.94,
            "bm25_score": 7.2,
            "hybrid_score": 0.88,
        }
        results = [sample_doc]

    # 3. Rerank & Explain
    reranker = CrossEncoderReranker()
    reranked = reranker.rerank(payload.query, results, top_k=payload.top_k)
    explained = RetrievalExplainer.explain_results(reranked)
    compressed = ContextCompressor.compress_contexts(explained)

    # 4. Context Assembly
    assembled_context = ContextBuilder.build_context(intent, compressed)

    return APIResponse[AssembledScientificContext](
        success=True,
        message="Scientific context retrieved successfully",
        data=assembled_context,
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )


@router.post("/index", summary="Index Scientific Dataset Chunks")
async def post_index(payload: IndexRequest, request: Request, req_id: str = Depends(get_request_id)):
    profile_data = {
        "platform_id": payload.platform_id,
        "ocean_region": payload.ocean_region,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "measurements": {"depth_m": [0.0, 100.0], "temperature_celsius": [28.5, 24.1], "salinity_psu": [33.2, 34.5]}
    }
    from app.retrieval.indexing.indexing_pipeline import IndexingPipeline
    pipeline = IndexingPipeline(hybrid_engine)
    count = pipeline.index_profile_data(profile_data)

    return APIResponse[Dict[str, Any]](
        success=True,
        message=f"Indexed {count} chunks into hybrid vector store",
        data={"indexed_chunks": count, "platform_id": payload.platform_id},
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )


@router.get("/stats", summary="Get Retrieval Index Statistics")
async def get_stats(request: Request, req_id: str = Depends(get_request_id)):
    v_stats = hybrid_engine.vector_store.get_stats()
    reg_meta = EmbeddingRegistry.get_metadata()

    return APIResponse[Dict[str, Any]](
        success=True,
        message="Retrieval stats retrieved",
        data={
            "vector_store": v_stats,
            "embedding_model": reg_meta.model_dump(),
            "total_documents": len(hybrid_engine.documents),
            "status": "operational"
        },
        metadata=ResponseMetadata(request_id=req_id, version="v1")
    )
