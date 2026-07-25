"""Test Settings and Application Configuration."""
from app.config.settings import settings


def test_settings_load():
    assert settings.PROJECT_NAME == "FloatChat"
    assert settings.VERSION == "1.0.0"
    assert settings.API_V1_STR == "/api/v1"
    assert settings.DATABASE_URL is not None
