"""Pagination dependency for list endpoints."""
from fastapi import Query
from app.core.constants import DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT


class PaginationParams:
    def __init__(
        self,
        page: int = Query(default=1, ge=1, description="Page number starting from 1"),
        limit: int = Query(
            default=DEFAULT_PAGINATION_LIMIT,
            ge=1,
            le=MAX_PAGINATION_LIMIT,
            description="Number of items per page"
        ),
    ):
        self.page = page
        self.limit = limit
        self.offset = (page - 1) * limit
