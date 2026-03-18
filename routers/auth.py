"""Authentication routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from httpx import HTTPStatusError

from models import AuthRequest, AuthResponse, ErrorResponse
from config import Settings, get_settings
from services import get_chat_service, ChatServiceClient

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_service(settings: Settings = Depends(get_settings)) -> ChatServiceClient:
    """Dependency to get the chat service client."""
    return get_chat_service(settings)


@router.post(
    "/login",
    response_model=AuthResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
        500: {"model": ErrorResponse, "description": "External API error"}
    }
)
async def login(
    request: AuthRequest,
    service: ChatServiceClient = Depends(get_service)
):
    """
    Authenticate with the external chat service.

    If credentials are not provided, uses the default configured credentials.
    """
    try:
        result = await service.authenticate(
            email=request.email,
            password=request.password
        )
        return AuthResponse(
            access_token=result["access_token"],
            token_type=result.get("token_type", "bearer"),
            expires_at=result.get("expires_at")
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except HTTPStatusError as e:
        if e.response.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"External API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )


@router.get("/status")
async def auth_status(service: ChatServiceClient = Depends(get_service)):
    """Check current authentication status."""
    return {
        "authenticated": service.is_authenticated,
        "has_token": service.access_token is not None
    }
