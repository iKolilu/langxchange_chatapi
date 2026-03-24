"""Configuration settings for the chat API service."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # External API Configuration
    base_url: str = "https://api.langxchange.ai"
    company_id: str = "demo-company-001"
    app_uuid: str = "GMA73HIA1LSQ"
    api_key: str = "nv_Uwx3h8PWalTyFAYT_KCNErXrEO_NEgZcMLXcMMa4IbA"
    agent_uuid: str = "f548d5fd-05a7-4d7f-9d31-00b9fedf70b1"

    # Internal API authentication credentials
    auth_email: str = "user1@ges.com"
    auth_password: str = "p@55w0rd"

    # Application settings
    app_name: str = "Chat API Gateway"
    debug: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
