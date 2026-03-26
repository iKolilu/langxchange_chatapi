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

from config import (
    Settings, get_settings,
    get_chat_mode, get_agent_uuid,
    get_session_uuid, set_session_uuid
)
from models import HealthResponse
from routers import (
    auth_router, sessions_router, messages_router,
    agents_router, config_router, websocket_router
)
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
    logger.info("Starting Chat API Gateway...")
    settings = get_settings()
    service = get_chat_service(settings)

    # Pre-authenticate external mode on startup
    try:
        await service.authenticate()
        logger.info("Pre-authentication (external) successful")
    except Exception as e:
        logger.warning(f"Pre-authentication failed: {e}. Will authenticate on first request.")

    yield

    logger.info("Shutting down Chat API Gateway...")
    await service.close()


app = FastAPI(
    title="Chat API Gateway",
    description="""
    A FastAPI backend that provides a clean REST interface for the LangXchange chat service.

    ## Features

    - **Authentication**: Manage authentication with the external chat API
    - **Sessions**: Create and manage chat sessions with AI agents
    - **Messages**: Send messages and receive AI responses
    - **WebSocket**: Real-time chat via WebSocket
    - **Configuration**: Switch between external/internal modes at runtime
    - **Convenience Endpoint**: Quick chat endpoint for simple interactions

    ## Getting Started

    1. Use `/auth/login` to authenticate (or let the API auto-authenticate)
    2. Select an agent with `POST /agents/select?agent_uuid=...`
    3. Create a session with `POST /sessions`
    4. Send messages with `POST /sessions/{session_uuid}/messages`
    5. Or use `POST /chat` for quick stateless interactions
    6. Or connect via WebSocket at `/ws/chat/{session_uuid}`

    ## Runtime State
    After selecting an agent and creating a session, all endpoints will
    automatically use those values — no need to pass them repeatedly.
    Check current state with `GET /config/state`.
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(sessions_router)
app.include_router(messages_router)
app.include_router(agents_router)
app.include_router(config_router)
app.include_router(websocket_router)


# ============ Root and Health Endpoints ============

@app.get("/", tags=["Health"])
async def root(settings: Settings = Depends(get_settings)):
    """Root endpoint with API information."""
    return {
        "service": "Chat API Gateway",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "runtime": {
            "chat_mode": get_chat_mode(),
            "agent_uuid": get_agent_uuid(settings),
            "session_uuid": get_session_uuid()
        }
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check(settings: Settings = Depends(get_settings)):
    """Health check endpoint."""
    service = get_chat_service(settings)
    mode = get_chat_mode()
    external_status = await service.health_check()

    return HealthResponse(
        status="healthy" if service.is_authenticated(mode) else "degraded",
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

    - Uses runtime agent UUID (from POST /agents/select) or config fallback
    - Uses runtime session UUID (from POST /sessions) or creates a new one
    - Respects current chat mode (external/internal)
    - If session_uuid is passed in body it takes priority over runtime state
    """
    service = get_chat_service(settings)
    mode = get_chat_mode()
    agent_uuid = get_agent_uuid(settings)

    # Priority: request body > runtime state > create new
    session_uuid = request.session_uuid or get_session_uuid()

    logger.info(f"Quick chat | mode={mode} | agent={agent_uuid} | session={session_uuid}")

    try:
        if not session_uuid:
            # No session available — create one
            if mode == "external":
                session_result = await service.create_session(
                    user_id=request.user_id,
                    system_prompt=request.system_prompt,
                    user_prompt=request.message,
                    agent_uuid=agent_uuid
                )
            else:
                session_result = await service.create_internal_session(
                    agent_uuid=agent_uuid
                )

            session_uuid = session_result["session_uuid"]
            set_session_uuid(session_uuid)  # save to runtime state
            logger.info(f"New session created and saved: {session_uuid}")

            # External API may return first response inline during session creation
            if mode == "external" and session_result.get("response"):
                return QuickChatResponse(
                    response=session_result["response"],
                    session_uuid=session_uuid,
                    processing_time_ms=session_result.get("processing_time_ms"),
                    tokens_used=session_result.get("tokens_used")
                )

        # Send the message using appropriate mode
        if mode == "external":
            result = await service.send_message(
                session_uuid=session_uuid,
                message=request.message,
                agent_uuid=agent_uuid
            )
        else:
            result = await service.send_internal_message(
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8083,
        reload=True,
        log_level="info"
    )