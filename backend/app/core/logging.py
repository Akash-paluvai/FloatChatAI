"""Loguru centralized logging setup with correlation ID and rotating file logs."""
import sys
import logging
from pathlib import Path
from loguru import logger
from app.config.settings import settings


class InterceptHandler(logging.Handler):
    """Intercept standard logging messages and redirect to Loguru."""
    def emit(self, record: logging.LogRecord) -> None:
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )


def setup_logging() -> None:
    """Initialize Loguru logging sinks and intercept standard library loggers."""
    # Clear default Loguru handlers
    logger.remove()

    # Log format with correlation ID
    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{extra[request_id]}</cyan> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
        "<level>{message}</level>"
    )

    # Console Logger
    logger.add(
        sys.stdout,
        level=settings.LOG_LEVEL,
        format=log_format,
        colorize=True,
        enqueue=True,
        filter=lambda record: record["extra"].setdefault("request_id", "SYS-INIT"),
    )

    # Rotating File Logger
    if settings.LOG_TO_FILE:
        log_dir = Path(settings.LOG_FILE_PATH).parent
        log_dir.mkdir(parents=True, exist_ok=True)
        logger.add(
            settings.LOG_FILE_PATH,
            rotation="10 MB",
            retention="30 days",
            compression="zip",
            level=settings.LOG_LEVEL,
            format=log_format,
            enqueue=True,
            filter=lambda record: record["extra"].setdefault("request_id", "SYS-INIT"),
        )

    # Redirect standard library & Uvicorn logs to Loguru
    logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)
    for _log in ("uvicorn", "uvicorn.access", "uvicorn.error", "fastapi", "sqlalchemy.engine"):
        _logger = logging.getLogger(_log)
        _logger.handlers = [InterceptHandler()]

    logger.bind(request_id="SYS-BOOT").info("FloatChat Loguru Logging initialized cleanly")
