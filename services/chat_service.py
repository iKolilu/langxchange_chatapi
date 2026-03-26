"""Chat service client for interacting with the external LangXchange API."""
import httpx
from typing import Optional, Dict, Any, Literal
from datetime import datetime, timedelta
import logging

from config import Settings

logger = logging.getLogger(__name__)


class ChatServiceClient:
    """Client for interacting with the external chat service API."""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.base_url = settings.base_url
        self.company_id = settings.company_id
        self.app_uuid = settings.app_uuid
        self.api_key = settings.api_key
        self.agent_uuid = settings.agent_uuid
        self.email = settings.auth_email
        self.password = settings.auth_password

        # Separate tokens for each mode
        self._external_token: Optional[str] = None
        self._external_token_expires_at: Optional[datetime] = None
        self._internal_token: Optional[str] = None
        self._internal_token_expires_at: Optional[datetime] = None

        # HTTP client
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client."""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(30.0, connect=10.0),
                follow_redirects=True
            )
        return self._client

    async def close(self):
        """Close the HTTP client."""
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    def is_authenticated(self, mode: Literal["external", "internal"] = "external") -> bool:
        """Check if we have a valid access token for the given mode."""
        if mode == "external":
            if not self._external_token:
                return False
            if self._external_token_expires_at and datetime.utcnow() >= self._external_token_expires_at:
                return False
            return True
        else:
            if not self._internal_token:
                return False
            if self._internal_token_expires_at and datetime.utcnow() >= self._internal_token_expires_at:
                return False
            return True

    @property
    def access_token(self) -> Optional[str]:
        """Get the current external access token."""
        return self._external_token

    def get_token(self, mode: Literal["external", "internal"] = "external") -> Optional[str]:
        """Get token for the given mode."""
        return self._external_token if mode == "external" else self._internal_token

    async def authenticate(
        self,
        email: Optional[str] = None,
        password: Optional[str] = None
    ) -> Dict[str, Any]:
        """Authenticate using external chat API key."""
        client = await self._get_client()

        url = f"{self.base_url}/exchat/auth/{self.company_id}/{self.app_uuid}"
        headers = {
            "x-api-key": self.api_key,
            "Content-Type": "application/json"
        }

        logger.info(f"Authenticating externally with {url}")

        response = await client.post(url, headers=headers)
        response.raise_for_status()

        data = response.json()

        self._external_token = data.get("access_token")
        expires_in = data.get("expires_in", 86400)
        self._external_token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in)

        logger.info("External authentication successful")

        return {
            "access_token": self._external_token,
            "token_type": "bearer",
            "expires_at": self._external_token_expires_at.isoformat() if self._external_token_expires_at else None,
            "app_name": data.get("app_name"),
            "company_id": data.get("company_id")
        }

    async def authenticate_internal(self) -> Dict[str, Any]:
        """Authenticate using internal API email/password."""
        client = await self._get_client()

        url = f"{self.base_url}/api/auth/login"
        headers = {"Content-Type": "application/json"}
        payload = {
            "email": self.email,
            "password": self.password
        }

        logger.info(f"Authenticating internally with {url}")

        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()

        data = response.json()

        self._internal_token = data.get("access_token")
        expires_in = data.get("expires_in", 86400)
        self._internal_token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in)

        logger.info("Internal authentication successful")

        return {
            "access_token": self._internal_token,
            "token_type": "bearer",
            "expires_at": self._internal_token_expires_at.isoformat() if self._internal_token_expires_at else None,
            "user": self.email
        }

    async def ensure_authenticated(self, mode: Literal["external", "internal"] = "external"):
        """Ensure we have a valid token for the given mode."""
        if not self.is_authenticated(mode):
            if mode == "external":
                await self.authenticate()
            else:
                await self.authenticate_internal()

    def _get_auth_headers(self, mode: Literal["external", "internal"] = "external") -> Dict[str, str]:
        """Get headers with authentication for the given mode."""
        token = self.get_token(mode)
        return {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

    # ============ External Chat Methods ============

    async def create_session(
        self,
        user_id: str,
        system_prompt: str,
        user_prompt: str = "Hello, I just started a new chat session.",
        use_fileconfig: bool = False,
        use_ddbconfig: bool = False,
        use_vectorconfig: bool = True,
        use_mcpconfig: bool = False,
        use_remote_storage: bool = False,
        agent_uuid: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a new external chat session."""
        await self.ensure_authenticated("external")
        client = await self._get_client()

        agent = agent_uuid or self.agent_uuid

        session_data = {
            "system_prompt": system_prompt,
            "user_id": user_id,
            "user_prompt": user_prompt,
            "use_fileconfig": use_fileconfig,
            "use_ddbconfig": use_ddbconfig,
            "use_vectorconfig": use_vectorconfig,
            "use_mcpconfig": use_mcpconfig,
            "use_remote_storage": use_remote_storage
        }

        url = f"{self.base_url}/exchat/{agent}/{self.app_uuid}/{user_id}/session"
        logger.info(f"Creating external session at {url}")

        response = await client.post(
            url,
            headers=self._get_auth_headers("external"),
            json=session_data
        )
        response.raise_for_status()

        result = response.json()
        result["agent_uuid"] = agent
        return result

    async def create_internal_session(
        self,
        agent_uuid: Optional[str] = None,
        title: Optional[str] = None,
        use_rag: bool = True,
    ) -> Dict[str, Any]:
        """Create a new internal API chat session."""
        await self.ensure_authenticated("internal")
        client = await self._get_client()

        agent = agent_uuid or self.agent_uuid

        session_data = {
            "title": title or f"Chat with Agent {agent}",
            "use_rag": use_rag,
        }

        url = f"{self.base_url}/api/chat/agent/{agent}/sessions"
        logger.info(f"Creating internal session at {url}")

        response = await client.post(
            url,
            headers=self._get_auth_headers("internal"),
            json=session_data
        )

        # Internal API returns 201 — treat both 200 and 201 as success
        if response.status_code not in (200, 201):
            response.raise_for_status()

        result = response.json()
        result["agent_uuid"] = agent

        # Normalize to match external session response shape
        if "session_uuid" not in result and "id" in result:
            result["session_uuid"] = result.get("id")
        if "agent_name" not in result:
            result["agent_name"] = agent

        return result

    async def send_message(
        self,
        session_uuid: str,
        message: str,
        agent_uuid: Optional[str] = None
    ) -> Dict[str, Any]:
        """Send a message via external chat API."""
        await self.ensure_authenticated("external")
        client = await self._get_client()

        agent = agent_uuid or self.agent_uuid
        url = f"{self.base_url}/exchat/{agent}/{self.app_uuid}/session/{session_uuid}/message"
        message_data = {"message": message}

        logger.info(f"Sending external message to session {session_uuid}")

        response = await client.post(
            url,
            headers=self._get_auth_headers("external"),
            json=message_data
        )
        response.raise_for_status()
        return response.json()

    async def send_internal_message(
        self,
        session_uuid: str,
        message: str,
        use_rag: bool = True
    ) -> Dict[str, Any]:
        """Send a message via internal API."""
        await self.ensure_authenticated("internal")
        client = await self._get_client()

        url = f"{self.base_url}/api/chat/sessions/{session_uuid}/messages"
        message_data = {
            "message": message,
            "use_rag": use_rag
        }

        logger.info(f"Sending internal message to session {session_uuid}")

        response = await client.post(
            url,
            headers=self._get_auth_headers("internal"),
            json=message_data
        )
        response.raise_for_status()
        return response.json()

    async def get_session_status(
        self,
        session_uuid: str,
        agent_uuid: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get session status via external chat API."""
        await self.ensure_authenticated("external")
        client = await self._get_client()

        agent = agent_uuid or self.agent_uuid
        url = f"{self.base_url}/exchat/{agent}/{self.app_uuid}/session/{session_uuid}"

        logger.info(f"Getting external session status for {session_uuid}")

        response = await client.get(
            url,
            headers=self._get_auth_headers("external")
        )
        response.raise_for_status()
        return response.json()

    async def get_internal_session_status(
        self,
        session_uuid: str
    ) -> Dict[str, Any]:
        """Get session status via internal API."""
        await self.ensure_authenticated("internal")
        client = await self._get_client()

        url = f"{self.base_url}/api/chat/sessions/{session_uuid}"

        logger.info(f"Getting internal session status for {session_uuid}")

        response = await client.get(
            url,
            headers=self._get_auth_headers("internal")
        )
        response.raise_for_status()
        return response.json()

    async def health_check(self) -> Dict[str, Any]:
        """Check the health of the external API."""
        client = await self._get_client()
        try:
            response = await client.get(f"{self.base_url}/health", timeout=5.0)
            if response.status_code == 200:
                return {"status": "healthy", "external_api": "connected"}
            return {"status": "degraded", "external_api": f"status_{response.status_code}"}
        except Exception as e:
            logger.warning(f"Health check failed: {e}")
            return {"status": "unhealthy", "external_api": "unreachable", "error": str(e)}

    async def list_agents(self) -> Dict[str, Any]:
        """List all available agents."""
        await self.ensure_authenticated("external")
        client = await self._get_client()

        url = f"{self.base_url}/exchat/agents"
        logger.info(f"Fetching agents from {url}")

        response = await client.get(
            url,
            headers=self._get_auth_headers("external")
        )
        response.raise_for_status()
        return {"agents": response.json()}


# Singleton instance
_chat_service_instance: Optional[ChatServiceClient] = None


def get_chat_service(settings: Settings) -> ChatServiceClient:
    """Get or create the chat service client singleton."""
    global _chat_service_instance
    if _chat_service_instance is None:
        _chat_service_instance = ChatServiceClient(settings)
    return _chat_service_instance