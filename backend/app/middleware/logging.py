"""StructuredLoggingMiddleware for request/response logging."""
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from loguru import logger


class StructuredLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        req_id = getattr(request.state, "request_id", "SYS-HTTP")
        logger.bind(request_id=req_id).info(f"Incoming Request: {request.method} {request.url.path}")

        response = await call_next(request)

        process_time = getattr(request.state, "process_time_ms", 0.0)
        logger.bind(request_id=req_id).info(
            f"Completed Request: {request.method} {request.url.path} -> Status {response.status_code} [{process_time:.2f}ms]"
        )
        return response
