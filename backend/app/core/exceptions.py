"""Centralized Exception Hierarchy & FastAPI Exception Handlers."""
from typing import Any, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from loguru import logger
from app.schemas.response import APIResponse, ResponseMetadata


class FloatChatException(Exception):
    """Base domain exception for FloatChat."""
    def __init__(self, message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR, details: Optional[Any] = None):
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)


class EntityNotFoundException(FloatChatException):
    def __init__(self, message: str = "Requested entity not found"):
        super().__init__(message=message, status_code=status.HTTP_404_NOT_FOUND)


class DatabaseConnectionException(FloatChatException):
    def __init__(self, message: str = "Database connection error"):
        super().__init__(message=message, status_code=status.HTTP_503_SERVICE_UNAVAILABLE)


class AIException(FloatChatException):
    def __init__(self, message: str = "AI inference engine error"):
        super().__init__(message=message, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ValidationException(FloatChatException):
    def __init__(self, message: str = "Validation error", details: Optional[Any] = None):
        super().__init__(message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, details=details)


def register_exception_handlers(app: Any) -> None:
    """Register custom exception handlers transforming errors into APIResponse envelope."""

    @app.exception_handler(FloatChatException)
    async def custom_exception_handler(request: Request, exc: FloatChatException):
        req_id = getattr(request.state, "request_id", "req_unknown")
        logger.bind(request_id=req_id).warning(f"Business Exception [{exc.status_code}]: {exc.message}")
        
        response_payload = APIResponse(
            success=False,
            message=exc.message,
            data=exc.details,
            metadata=ResponseMetadata(request_id=req_id)
        )
        return JSONResponse(status_code=exc.status_code, content=response_payload.model_dump())

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        req_id = getattr(request.state, "request_id", "req_unknown")
        logger.bind(request_id=req_id).warning(f"Request Validation Error: {exc.errors()}")
        
        response_payload = APIResponse(
            success=False,
            message="Input validation failed",
            data={"errors": exc.errors()},
            metadata=ResponseMetadata(request_id=req_id)
        )
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=response_payload.model_dump())

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        req_id = getattr(request.state, "request_id", "req_unknown")
        response_payload = APIResponse(
            success=False,
            message=str(exc.detail),
            metadata=ResponseMetadata(request_id=req_id)
        )
        return JSONResponse(status_code=exc.status_code, content=response_payload.model_dump())

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        req_id = getattr(request.state, "request_id", "req_unknown")
        logger.bind(request_id=req_id).exception(f"Unhandled Exception: {str(exc)}")
        
        response_payload = APIResponse(
            success=False,
            message="Internal server error occurred",
            metadata=ResponseMetadata(request_id=req_id)
        )
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=response_payload.model_dump())
