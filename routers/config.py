"""Configuration management routes."""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Literal, Optional

from config import (
    get_settings, Settings,
    get_chat_mode, set_chat_mode,
    get_agent_uuid, set_agent_uuid,
    get_session_uuid, set_session_uuid
)

router = APIRouter(prefix="/config", tags=["Configuration"])


class ChatModeRequest(BaseModel):
    mode: Literal["external", "internal"]

class ChatModeResponse(BaseModel):
    mode: Literal["external", "internal"]
    message: str

class RuntimeStateRequest(BaseModel):
    agent_uuid: Optional[str] = None
    session_uuid: Optional[str] = None

class RuntimeStateResponse(BaseModel):
    agent_uuid: str
    session_uuid: Optional[str]
    chat_mode: Literal["external", "internal"]


@router.get("/mode", response_model=ChatModeResponse)
async def get_mode():
    """Get the current chat mode."""
    mode = get_chat_mode()
    return ChatModeResponse(mode=mode, message=f"Currently using {mode} chat mode")


@router.post("/mode", response_model=ChatModeResponse)
async def switch_mode(request: ChatModeRequest):
    """Switch between external and internal chat modes."""
    set_chat_mode(request.mode)
    return ChatModeResponse(mode=request.mode, message=f"Switched to {request.mode} chat mode")


@router.get("/state", response_model=RuntimeStateResponse)
async def get_runtime_state(settings: Settings = Depends(get_settings)):
    """Get the current runtime state (active agent, session, mode)."""
    return RuntimeStateResponse(
        agent_uuid=get_agent_uuid(settings),
        session_uuid=get_session_uuid(),
        chat_mode=get_chat_mode()
    )


@router.post("/state", response_model=RuntimeStateResponse)
async def set_runtime_state(
    request: RuntimeStateRequest,
    settings: Settings = Depends(get_settings)
):
    """
    Manually override runtime agent UUID and/or session UUID.
    
    Use this to pin a specific agent or session without going through
    the select agent / create session flow.
    """
    if request.agent_uuid:
        set_agent_uuid(request.agent_uuid)
    if request.session_uuid:
        set_session_uuid(request.session_uuid)

    return RuntimeStateResponse(
        agent_uuid=get_agent_uuid(settings),
        session_uuid=get_session_uuid(),
        chat_mode=get_chat_mode()
    )


@router.get("/info")
async def get_config_info(settings: Settings = Depends(get_settings)):
    """Get full configuration — static config plus current runtime overrides."""
    return {
        "base_url": settings.base_url,
        "company_id": settings.company_id,
        "app_uuid": settings.app_uuid,
        "app_name": settings.app_name,
        "chat_mode": get_chat_mode(),
        "agent_uuid": get_agent_uuid(settings),  # runtime override or config fallback
        "session_uuid": get_session_uuid(),
        "defaults": {
            "agent_uuid": settings.agent_uuid,   # raw config value for reference
        }
    }