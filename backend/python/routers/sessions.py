"""Session management routes."""
from fastapi import APIRouter, Depends, HTTPException, status, Path
from httpx import HTTPStatusError
from typing import Optional

from models import (
    CreateSessionRequest,
    SessionResponse,
    SessionStatusResponse,
    ErrorResponse
)
from config import Settings, get_settings
from services import get_chat_service, ChatServiceClient

router = APIRouter(prefix="/sessions", tags=["Sessions"])


def get_service(settings: Settings = Depends(get_settings)) -> ChatServiceClient:
    """Dependency to get the chat service client."""
    return get_chat_service(settings)


@router.post(
    "",
    response_model=SessionResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        401: {"model": ErrorResponse, "description": "Not authenticated"},
        500: {"model": ErrorResponse, "description": "Session creation failed"}
    }
)
async def create_session(
    request: CreateSessionRequest,
    agent_uuid: Optional[str] = None,
    service: ChatServiceClient = Depends(get_service)
):
    """
    Create a new chat session with the AI agent.

    This endpoint initializes a new conversation session with the specified
    configuration options.
    """
    try:
        result = await service.create_session(
            user_id=request.user_id,
            system_prompt=request.system_prompt,
            user_prompt=request.user_prompt,
            use_fileconfig=request.use_fileconfig,
            use_ddbconfig=request.use_ddbconfig,
            use_vectorconfig=request.use_vectorconfig,
            use_mcpconfig=request.use_mcpconfig,
            use_remote_storage=request.use_remote_storage,
            agent_uuid=agent_uuid
        )
        return SessionResponse(**result)
    except HTTPStatusError as e:
        if e.response.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required or token expired"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Session creation failed: {e.response.text}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Session creation failed: {str(e)}"
        )


@router.get(
    "/{session_uuid}",
    response_model=SessionStatusResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Session not found"},
        500: {"model": ErrorResponse, "description": "Failed to get session status"}
    }
)
async def get_session_status(
    session_uuid: str = Path(..., description="The session UUID"),
    agent_uuid: Optional[str] = None,
    service: ChatServiceClient = Depends(get_service)
):
    """
    Get the status of an existing chat session.

    Returns detailed information about the session including its current state,
    creation time, and configuration.
    """
    try:
        result = await service.get_session_status(
            session_uuid=session_uuid,
            agent_uuid=agent_uuid
        )
        return SessionStatusResponse(
            session_uuid=session_uuid,
            status=result.get("status", "unknown"),
            created_at=result.get("created_at"),
            updated_at=result.get("updated_at"),
            system_prompt=result.get("system_prompt")
        )
    except HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Session {session_uuid} not found"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get session status: {e.response.text}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get session status: {str(e)}"
        )
