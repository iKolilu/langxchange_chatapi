"""WebSocket chat routes."""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Optional
import httpx
import json
import logging

from config import get_settings, Settings, get_chat_mode
from services import get_chat_service

router = APIRouter(tags=["WebSocket"])
logger = logging.getLogger(__name__)


@router.websocket("/ws/chat/{session_uuid}")
async def websocket_chat(
    websocket: WebSocket,
    session_uuid: str,
    agent_uuid: Optional[str] = None,
    settings: Settings = Depends(get_settings)
):
    """
    WebSocket endpoint for real-time chat.

    Connect and send JSON messages in this format:
    { "message": "your text here" }

    The server will respond with:
    { "response": "agent reply", "session_uuid": "...", "tokens_used": 123 }
    """
    await websocket.accept()
    service = get_chat_service(settings)
    mode = get_chat_mode()
    resolved_agent = agent_uuid or settings.agent_uuid

    logger.info(f"WebSocket connected: session={session_uuid} mode={mode}")

    await websocket.send_json({
        "type": "connected",
        "session_uuid": session_uuid,
        "mode": mode,
        "message": f"Connected in {mode} mode. Send messages as JSON: {{\"message\": \"hello\"}}"
    })

    try:
        while True:
            # Receive message
            try:
                raw = await websocket.receive_text()
                data = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid JSON. Send messages as: {\"message\": \"your text\"}"
                })
                continue

            user_message = data.get("message", "").strip()
            if not user_message:
                await websocket.send_json({
                    "type": "error",
                    "message": "Missing 'message' field"
                })
                continue

            # Typing indicator
            await websocket.send_json({"type": "typing", "status": True})

            try:
                if mode == "external":
                    result = await service.send_message(
                        session_uuid=session_uuid,
                        message=user_message,
                        agent_uuid=resolved_agent
                    )
                else:
                    result = await service.send_internal_message(
                        session_uuid=session_uuid,
                        message=user_message
                    )

                response_text = result.get("response") or result.get("message") or ""

                await websocket.send_json({
                    "type": "message",
                    "response": response_text,
                    "session_uuid": session_uuid,
                    "processing_time_ms": result.get("processing_time_ms"),
                    "tokens_used": result.get("tokens_used")
                })

            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error sending message: {e}")
                await websocket.send_json({
                    "type": "error",
                    "message": f"Failed to get response: {e.response.status_code}"
                })
            except Exception as e:
                logger.error(f"Error sending message: {e}")
                await websocket.send_json({
                    "type": "error",
                    "message": f"Unexpected error: {str(e)}"
                })
            finally:
                await websocket.send_json({"type": "typing", "status": False})

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: session={session_uuid}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except:
            pass
        