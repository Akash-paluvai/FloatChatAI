"""Environment Enum configuration."""
from enum import Enum


class EnvironmentOption(str, Enum):
    DEVELOPMENT = "development"
    TESTING = "testing"
    STAGING = "staging"
    PRODUCTION = "production"
