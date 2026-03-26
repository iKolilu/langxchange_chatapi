"""Agent management routes."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from httpx import HTTPStatusError
from typing import Optional

from models import AgentResponse, AgentsListResponse, ErrorResponse
from config import Settings, get_settings, set_agent_uuid, get_agent_uuid
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


@router.post(
    "/select",
    responses={
        404: {"model": ErrorResponse, "description": "Agent not found"},
        500: {"model": ErrorResponse, "description": "Failed to select agent"}
    }
)
async def select_agent(
    agent_uuid: str = Query(..., description="The agent UUID to select"),
    settings: Settings = Depends(get_settings),
    service: ChatServiceClient = Depends(get_service)
):
    """
    Select an agent to use for subsequent requests.

    Sets the runtime agent UUID — all endpoints that use agent_uuid
    will use this value until changed.
    """
    try:
        # Verify the agent exists by checking against the list
        result = await service.list_agents()
        agents_data = result.get("agents", [])
        agent = next((a for a in agents_data if a.get("agent_uuid") == agent_uuid), None)

        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent {agent_uuid} not found"
            )

        # Store in runtime state
        set_agent_uuid(agent_uuid)

        return {
            "message": f"Agent selected successfully",
            "agent_uuid": agent_uuid,
            "agent_name": agent.get("name", ""),
            "description": agent.get("description", "")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to select agent: {str(e)}"
        )