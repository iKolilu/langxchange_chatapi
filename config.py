"""Configuration settings for the chat API service."""
from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache
from typing import Literal
"""Configuration settings for the chat API service."""
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Literal, Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # External API Configuration
    base_url: str = "https://api.langxchange.ai"
    company_id: str = "demo-company-001"
    app_uuid: str = "GMA73HIA1LSQ"
    api_key: str = "nv_Uwx3h8PWalTyFAYT_KCNErXrEO_NEgZcMLXcMMa4IbA"
    agent_uuid: str = "cefc0d7a-6d06-442a-a8d2-a2eef25a17ea"

    # Internal API authentication credentials
    auth_email: str = "user1@ges.com"
    auth_password: str = "p@55w0rd"

    # Application settings
    app_name: str = "Chat API Gateway"
    debug: bool = False

    # Chat mode: "external" uses exchat endpoints + API key
    #            "internal" uses /api endpoints + email/password
    chat_mode: Literal["external", "internal"] = "external"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# ============ Runtime State ============

_runtime_chat_mode: Literal["external", "internal"] = "external"
_runtime_agent_uuid: Optional[str] = None        # ← was missing
_runtime_session_uuid: Optional[str] = None      # ← was missing


# --- Chat mode ---
def get_chat_mode() -> Literal["external", "internal"]:
    return _runtime_chat_mode

def set_chat_mode(mode: Literal["external", "internal"]):
    global _runtime_chat_mode
    _runtime_chat_mode = mode


# --- Agent UUID ---
def get_agent_uuid(settings: Settings) -> str:
    return _runtime_agent_uuid or settings.agent_uuid

def set_agent_uuid(agent_uuid: str):
    global _runtime_agent_uuid
    _runtime_agent_uuid = agent_uuid


# --- Session UUID ---
def get_session_uuid() -> Optional[str]:
    return _runtime_session_uuid

def set_session_uuid(session_uuid: str):
    global _runtime_session_uuid
    _runtime_session_uuid = session_uuid


@lru_cache
def get_settings() -> Settings:
    return Settings()

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # External API Configuration
    base_url: str = "https://api.langxchange.ai"
    company_id: str = "demo-company-001"
    app_uuid: str = "GMA73HIA1LSQ"
    api_key: str = "nv_Uwx3h8PWalTyFAYT_KCNErXrEO_NEgZcMLXcMMa4IbA"
    agent_uuid: str = "cefc0d7a-6d06-442a-a8d2-a2eef25a17ea"

    # Internal API authentication credentials
    auth_email: str = "user1@ges.com"
    auth_password: str = "p@55w0rd"

    # Application settings
    app_name: str = "Chat API Gateway"
    debug: bool = False

    # Chat mode: "external" uses exchat endpoints + API key
    #            "internal" uses /api endpoints + email/password
    chat_mode: Literal["external", "internal"] = "external"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Runtime mode state — separate from settings so it can be changed without
# restarting the server. Settings is cached/immutable after startup.
_runtime_chat_mode: Literal["external", "internal"] = "external"


def get_chat_mode() -> Literal["external", "internal"]:
    """Get the current runtime chat mode."""
    return _runtime_chat_mode


def set_chat_mode(mode: Literal["external", "internal"]):
    """Set the runtime chat mode."""
    global _runtime_chat_mode
    _runtime_chat_mode = mode

# --- Agent UUID ---
def get_agent_uuid(settings: Settings) -> str:
    """Return runtime agent UUID if set, otherwise fall back to config."""
    return _runtime_agent_uuid or settings.agent_uuid

def set_agent_uuid(agent_uuid: str):
    global _runtime_agent_uuid
    _runtime_agent_uuid = agent_uuid


# --- Session UUID ---
def get_session_uuid() -> Optional[str]:
    """Return the last active session UUID if set."""
    return _runtime_session_uuid

def set_session_uuid(session_uuid: str):
    global _runtime_session_uuid
    _runtime_session_uuid = session_uuid


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()