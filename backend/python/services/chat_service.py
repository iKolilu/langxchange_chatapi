"""Chat service client for interacting with the external LangXchange API."""
import httpx
from typing import Optional, Dict, Any
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

        # Token management
        self._access_token: Optional[str] = None
        self._token_expires_at: Optional[datetime] = None

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

    @property
    def is_authenticated(self) -> bool:
        """Check if we have a valid access token."""
        if not self._access_token:
            return False
        if self._token_expires_at and datetime.utcnow() >= self._token_expires_at:
            return False
        return True

    @property
    def access_token(self) -> Optional[str]:
        """Get the current access token."""
        return self._access_token

    async def authenticate(self) -> Dict[str, Any]:
        """
        Authenticate with the external API using the API key for external chat.

        Returns:
            Authentication response with access token
        """
        client = await self._get_client()

        url = f"{self.base_url}/exchat/auth/{self.company_id}/{self.app_uuid}"
        headers = {
            "x-api-key": self.api_key,
            "Content-Type": "application/json"
        }

        logger.info(f"Authenticating with {url} using API Key")

        response = await client.post(url, headers=headers)
        response.raise_for_status()

        data = response.json()

        # Store the token
        self._access_token = data.get("access_token")
        # Assume token expires in 24 hours if not specified
        expires_in = data.get("expires_in", 86400)
        self._token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in)

        logger.info("Authentication successful")

        return {
            "access_token": self._access_token,
            "token_type": "bearer",
            "expires_at": self._token_expires_at.isoformat() if self._token_expires_at else None,
            "app_name": data.get("app_name"),
            "company_id": data.get("company_id")
        }

    async def ensure_authenticated(self):
        """Ensure we have a valid authentication token."""
        if not self.is_authenticated:
            await self.authenticate()

    def _get_auth_headers(self) -> Dict[str, str]:
        """Get headers with authentication."""
        return {
            "Authorization": f"Bearer {self._access_token}",
            "Content-Type": "application/json"
        }

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
        """
        Create a new chat session.

        Args:
            user_id: Unique identifier for the user
            system_prompt: System prompt for the AI agent
            user_prompt: Initial user message
            use_fileconfig: Enable file configuration
            use_ddbconfig: Enable database configuration
            use_vectorconfig: Enable vector/RAG configuration
            use_mcpconfig: Enable MCP configuration
            use_remote_storage: Enable remote storage
            agent_uuid: Optional agent UUID override

        Returns:
            Session creation response
        """
        await self.ensure_authenticated()
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

        logger.info(f"Creating session at {url}")

        response = await client.post(
            url,
            headers=self._get_auth_headers(),
            json=session_data
        )
        response.raise_for_status()

        return response.json()

    async def send_message(
        self,
        session_uuid: str,
        message: str,
        agent_uuid: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send a message to an active chat session.

        Args:
            session_uuid: The session UUID
            message: The message content
            agent_uuid: Optional agent UUID override

        Returns:
            Message response from the agent
        """
        await self.ensure_authenticated()
        client = await self._get_client()

        agent = agent_uuid or self.agent_uuid

        url = f"{self.base_url}/exchat/{agent}/{self.app_uuid}/session/{session_uuid}/message"

        message_data = {"message": message}

        logger.info(f"Sending message to session {session_uuid}")

        response = await client.post(
            url,
            headers=self._get_auth_headers(),
            json=message_data
        )
        response.raise_for_status()

        return response.json()

    async def get_session_status(
        self,
        session_uuid: str,
        agent_uuid: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get the status of a chat session.

        Args:
            session_uuid: The session UUID
            agent_uuid: Optional agent UUID override

        Returns:
            Session status information
        """
        await self.ensure_authenticated()
        client = await self._get_client()

        agent = agent_uuid or self.agent_uuid

        url = f"{self.base_url}/exchat/{agent}/{self.app_uuid}/session/{session_uuid}"

        logger.info(f"Getting status for session {session_uuid}")

        response = await client.get(
            url,
            headers=self._get_auth_headers()
        )
        response.raise_for_status()

        return response.json()

    async def health_check(self) -> Dict[str, Any]:
        """
        Check the health of the external API.

        Returns:
            Health status information
        """
        client = await self._get_client()

        try:
            # Try to reach the base URL
            response = await client.get(f"{self.base_url}/health", timeout=5.0)
            if response.status_code == 200:
                return {"status": "healthy", "external_api": "connected"}
            return {"status": "degraded", "external_api": f"status_{response.status_code}"}
        except Exception as e:
            logger.warning(f"Health check failed: {e}")
            return {"status": "unhealthy", "external_api": "unreachable", "error": str(e)}


# Singleton instance holder
_chat_service_instance: Optional[ChatServiceClient] = None


def get_chat_service(settings: Settings) -> ChatServiceClient:
    """Get or create the chat service client singleton."""
    global _chat_service_instance
    if _chat_service_instance is None:
        _chat_service_instance = ChatServiceClient(settings)
    return _chat_service_instance
