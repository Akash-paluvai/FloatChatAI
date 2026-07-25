"""RequestIDMiddleware for correlation ID tracking across microservice calls."""
import uuid
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from loguru import logger


class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Extract request ID from header or generate a new UUID
        request_id = request.headers.get("X-Request-ID", f"req_{uuid.uuid4().hex[:10]}")
        request.state.request_id = request_id

        # Bind request_id to Loguru context
        with logger.contextualize(request_id=request_id):
            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id
            return response
