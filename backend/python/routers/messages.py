"""Message handling routes."""
from fastapi import APIRouter, Depends, HTTPException, status, Path
from httpx import HTTPStatusError
from typing import Optional

from models import SendMessageRequest, MessageResponse, ErrorResponse
from config import Settings, get_settings
from services import get_chat_service, ChatServiceClient

router = APIRouter(prefix="/sessions", tags=["Messages"])


def get_service(settings: Settings = Depends(get_settings)) -> ChatServiceClient:
    """Dependency to get the chat service client."""
    return get_chat_service(settings)


@router.post(
    "/{session_uuid}/messages",
    response_model=MessageResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Not authenticated"},
        404: {"model": ErrorResponse, "description": "Session not found"},
        500: {"model": ErrorResponse, "description": "Message sending failed"}
    }
)
async def send_message(
    request: SendMessageRequest,
    session_uuid: str = Path(..., description="The session UUID"),
    agent_uuid: Optional[str] = None,
    service: ChatServiceClient = Depends(get_service)
):
    """
    Send a message to an active chat session.

    The message will be processed by the AI agent and a response will be returned.
    """
    try:
        result = await service.send_message(
            session_uuid=session_uuid,
            message=request.message,
            agent_uuid=agent_uuid
        )
        return MessageResponse(
            response=result.get("response"),
            message=result.get("message"),
            processing_time_ms=result.get("processing_time_ms"),
            tokens_used=result.get("tokens_used"),
            timestamp=result.get("timestamp")
        )
    except HTTPStatusError as e:
        if e.response.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required or token expired"
            )
        if e.response.status_code == 404:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Session {session_uuid} not found"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Message sending failed: {e.response.text}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Message sending failed: {str(e)}"
        )
