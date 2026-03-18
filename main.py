"""
Chat API Gateway - FastAPI Backend

A FastAPI backend service that wraps the external LangXchange chat API,
providing a clean REST interface for chat operations.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from config import Settings, get_settings
from models import HealthResponse, CreateSessionRequest, SendMessageRequest, MessageResponse
from routers import auth_router, sessions_router, messages_router
from services import get_chat_service, ChatServiceClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup/shutdown events."""
    # Startup
    logger.info("Starting Chat API Gateway...")
    settings = get_settings()
    service = get_chat_service(settings)

    # Pre-authenticate on startup
    try:
        await service.authenticate()
        logger.info("Pre-authentication successful")
    except Exception as e:
        logger.warning(f"Pre-authentication failed: {e}. Will authenticate on first request.")

    yield

    # Shutdown
    logger.info("Shutting down Chat API Gateway...")
    await service.close()


# Create FastAPI application
app = FastAPI(
    title="Chat API Gateway",
    description="""
    A FastAPI backend that provides a clean REST interface for the LangXchange chat service.

    ## Features

    - **Authentication**: Manage authentication with the external chat API
    - **Sessions**: Create and manage chat sessions with AI agents
    - **Messages**: Send messages and receive AI responses
    - **Convenience Endpoint**: Quick chat endpoint for simple interactions

    ## Getting Started

    1. Use `/auth/login` to authenticate (or let the API auto-authenticate)
    2. Create a session with `/sessions`
    3. Send messages with `/sessions/{session_uuid}/messages`

    Or use the convenience `/chat` endpoint for quick interactions.
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(sessions_router)
app.include_router(messages_router)


# ============ Root and Health Endpoints ============

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint with API information."""
    return {
        "service": "Chat API Gateway",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check(settings: Settings = Depends(get_settings)):
    """
    Health check endpoint.

    Returns the health status of both this service and the external API.
    """
    service = get_chat_service(settings)
    external_status = await service.health_check()

    return HealthResponse(
        status="healthy" if service.is_authenticated else "degraded",
        service="Chat API Gateway",
        version="1.0.0",
        external_api_status=external_status.get("external_api", "unknown")
    )


# ============ Convenience Chat Endpoint ============

class QuickChatRequest(BaseModel):
    """Quick chat request model."""
    message: str
    user_id: str = "default-user"
    session_uuid: Optional[str] = None
    system_prompt: str = "You are a helpful AI assistant."


class QuickChatResponse(BaseModel):
    """Quick chat response model."""
    response: str
    session_uuid: str
    processing_time_ms: Optional[float] = None
    tokens_used: Optional[int] = None


@app.post(
    "/chat",
    response_model=QuickChatResponse,
    tags=["Quick Chat"],
    summary="Quick chat endpoint"
)
async def quick_chat(
    request: QuickChatRequest,
    settings: Settings = Depends(get_settings)
):
    """
    Convenience endpoint for quick chat interactions.

    This endpoint handles session creation automatically if no session_uuid is provided.
    Ideal for simple, stateless chat interactions.

    - If `session_uuid` is provided, sends a message to that existing session
    - If `session_uuid` is not provided, creates a new session first
    """
    service = get_chat_service(settings)

    try:
        session_uuid = request.session_uuid

        # Create session if not provided
        if not session_uuid:
            session_result = await service.create_session(
                user_id=request.user_id,
                system_prompt=request.system_prompt,
                user_prompt=request.message
            )
            session_uuid = session_result["session_uuid"]

            # If this was a session creation, the response is already in session_result
            # The external API might return the first response in session creation
            if "response" in session_result and session_result["response"]:
                return QuickChatResponse(
                    response=session_result["response"],
                    session_uuid=session_uuid,
                    processing_time_ms=session_result.get("processing_time_ms"),
                    tokens_used=session_result.get("tokens_used")
                )

        # Send the message
        result = await service.send_message(
            session_uuid=session_uuid,
            message=request.message
        )

        response_text = result.get("response") or result.get("message") or ""

        return QuickChatResponse(
            response=response_text,
            session_uuid=session_uuid,
            processing_time_ms=result.get("processing_time_ms"),
            tokens_used=result.get("tokens_used")
        )

    except Exception as e:
        logger.error(f"Quick chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat failed: {str(e)}"
        )


# ============ Configuration Info Endpoint ============

@app.get("/config/info", tags=["Configuration"])
async def get_config_info(settings: Settings = Depends(get_settings)):
    """
    Get non-sensitive configuration information.

    Returns the current configuration settings (excluding sensitive data).
    """
    return {
        "base_url": settings.base_url,
        "company_id": settings.company_id,
        "app_uuid": settings.app_uuid,
        "agent_uuid": settings.agent_uuid,
        "app_name": settings.app_name
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8083,
        reload=True,
        log_level="info"
    )
