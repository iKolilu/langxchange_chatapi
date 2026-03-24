"""Agent management routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from httpx import HTTPStatusError

from models import AgentResponse, AgentsListResponse, ErrorResponse
from config import Settings, get_settings
from services import get_chat_service, ChatServiceClient

router = APIRouter(prefix="/agents", tags=["Agents"])


def get_service(settings: Settings = Depends(get_settings)) -> ChatServiceClient:
    """Dependency to get the chat service client."""
    return get_chat_service(settings)


@router.get(
    "",
    response_model=AgentsListResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Not authenticated"},
        500: {"model": ErrorResponse, "description": "Failed to list agents"}
    }
)
async def list_agents(service: ChatServiceClient = Depends(get_service)):
    """
    List all available agents for the current application.

    Returns a list of agents that can be used for chat sessions.
    """
    try:
        result = await service.list_agents()
        agents_data = result.get("agents", [])
        
        agents = [
            AgentResponse(
                name=agent.get("name", ""),
                agent_uuid=agent.get("agent_uuid", ""),
                description=agent.get("description", "")
            )
            for agent in agents_data
        ]
        
        return AgentsListResponse(agents=agents)
    except HTTPStatusError as e:
        if e.response.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required or token expired"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list agents: {e.response.text}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list agents: {str(e)}"
        )
