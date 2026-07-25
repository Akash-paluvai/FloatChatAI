"""Application settings class using Pydantic Settings."""
from typing import List, Optional
from pydantic import Field, AliasChoices
from pydantic_settings import BaseSettings, SettingsConfigDict
from app.config.environment import EnvironmentOption


class Settings(BaseSettings):
    """Centralized configuration driven by environment variables."""
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # General App Configuration
    PROJECT_NAME: str = "FloatChat"
    VERSION: str = "1.0.0"
    ENVIRONMENT: EnvironmentOption = EnvironmentOption.DEVELOPMENT
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = Field(default="super-secret-key-change-in-production-floatchat-2026")
    ALLOWED_HOSTS: List[str] = Field(default=["*"])

    # Logging Configuration
    LOG_LEVEL: str = Field(default="INFO")
    LOG_TO_FILE: bool = Field(default=True)
    LOG_FILE_PATH: str = Field(default="logs/floatchat.log")

    # Future Database Infrastructure Placeholders (PostgreSQL + PostGIS)
    DATABASE_URL: Optional[str] = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/floatchat",
        validation_alias=AliasChoices("DATABASE_URL", "POSTGRES_URL")
    )
    DB_POOL_SIZE: int = Field(default=20)
    DB_MAX_OVERFLOW: int = Field(default=10)

    # Future Cache & Vector DB Placeholders
    REDIS_URL: Optional[str] = Field(default="redis://localhost:6379/0")
    VECTOR_DB_URL: Optional[str] = Field(default="http://localhost:8000/chroma")
    VECTOR_DB_COLLECTION: str = Field(default="argo_embeddings")

    # Future AI & LLM Integration Placeholders
    OPENAI_API_KEY: Optional[str] = Field(default=None)
    ANTHROPIC_API_KEY: Optional[str] = Field(default=None)
    LANGCHAIN_TRACING_V2: bool = Field(default=False)

    # Storage & Export Paths
    PARQUET_DATA_DIR: str = Field(default="./data/parquet")
    EXPORT_STORAGE_DIR: str = Field(default="./data/exports")

    @property
    def is_dev(self) -> bool:
        return self.ENVIRONMENT == EnvironmentOption.DEVELOPMENT

    @property
    def is_testing(self) -> bool:
        return self.ENVIRONMENT == EnvironmentOption.TESTING


settings = Settings()
