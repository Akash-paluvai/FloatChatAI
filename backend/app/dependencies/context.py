"""Request context & request_id dependency helper."""
from typing import Optional
from fastapi import Request


def get_request_id(request: Request) -> str:
    """Retrieve unique correlation request ID attached by RequestIDMiddleware."""
    return getattr(request.state, "request_id", "req_unknown")


def get_request_context(request: Request) -> dict:
    """Retrieve request metadata context dict."""
    return {
        "request_id": get_request_id(request),
        "client_host": request.client.host if request.client else "unknown",
        "method": request.method,
        "url": str(request.url),
    }
