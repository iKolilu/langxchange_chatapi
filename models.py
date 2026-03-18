"""Pydantic models for request/response schemas."""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


# ============ Authentication Models ============

class AuthRequest(BaseModel):
    """Authentication request model."""
    email: Optional[str] = None
    password: Optional[str] = None


class AuthResponse(BaseModel):
    """Authentication response model."""
    access_token: str
    token_type: str = "bearer"
    expires_at: Optional[datetime] = None


# ============ Session Models ============

class CreateSessionRequest(BaseModel):
    """Request model for creating a chat session."""
    system_prompt: str = Field(
        default="You are a helpful AI assistant. Please provide clear, concise, and helpful responses.",
        description="System prompt for the AI agent"
    )
    user_id: str = Field(
        default="default-user",
        description="Unique identifier for the user"
    )
    user_prompt: str = Field(
        default="Hello, I just started a new chat session.",
        description="Initial user message"
    )
    use_fileconfig: bool = False
    use_ddbconfig: bool = False
    use_vectorconfig: bool = True
    use_mcpconfig: bool = False
    use_remote_storage: bool = False


class LLMConfig(BaseModel):
    """LLM configuration details."""
    provider: Optional[str] = None
    model: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None


class ConfigurationsUsed(BaseModel):
    """Configuration usage status."""
    vector_config: bool = False
    file_config: bool = False
    database_config: bool = False
    mcp_config: bool = False


class SessionResponse(BaseModel):
    """Response model for session operations."""
    session_id: str
    session_uuid: str
    agent_name: str
    status: Optional[str] = None
    llm_config: Optional[LLMConfig] = None
    configurations_used: Optional[ConfigurationsUsed] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class SessionStatusResponse(BaseModel):
    """Response model for session status."""
    session_uuid: str
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    system_prompt: Optional[str] = None


# ============ Message Models ============

class SendMessageRequest(BaseModel):
    """Request model for sending a message."""
    message: str = Field(..., description="The message content to send")


class MessageResponse(BaseModel):
    """Response model for message operations."""
    response: Optional[str] = None
    message: Optional[str] = None
    processing_time_ms: Optional[float] = None
    tokens_used: Optional[int] = None
    timestamp: Optional[str] = None


# ============ Health Check Models ============

class HealthResponse(BaseModel):
    """Health check response model."""
    status: str = "healthy"
    service: str
    version: str = "1.0.0"
    external_api_status: Optional[str] = None


# ============ Error Models ============

class ErrorResponse(BaseModel):
    """Error response model."""
    detail: str
    error_code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
