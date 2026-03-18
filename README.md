# Chat API Gateway

A FastAPI backend service that wraps the external LangXchange chat API, providing a clean REST interface for chat operations.

## Features

- **Authentication Management**: Handles token-based authentication with the external API
- **Session Management**: Create and manage chat sessions
- **Message Handling**: Send messages and receive AI responses
- **Quick Chat Endpoint**: Convenience endpoint for simple interactions
- **Auto-reconnection**: Automatically re-authenticates when tokens expire

## Project Structure

```
chat_api/
├── main.py              # FastAPI application entry point
├── config.py            # Configuration settings
├── models.py            # Pydantic models
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
├── routers/
│   ├── __init__.py
│   ├── auth.py          # Authentication routes
│   ├── sessions.py      # Session management routes
│   └── messages.py      # Message handling routes
└── services/
    ├── __init__.py
    └── chat_service.py  # External API client
```

## Installation

1. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

## Running the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or run directly
python main.py
```

## API Endpoints

### Health & Info
- `GET /` - API information
- `GET /health` - Health check
- `GET /config/info` - Non-sensitive configuration info

### Authentication
- `POST /auth/login` - Authenticate with the external API
- `GET /auth/status` - Check authentication status

### Sessions
- `POST /sessions` - Create a new chat session
- `GET /sessions/{session_uuid}` - Get session status

### Messages
- `POST /sessions/{session_uuid}/messages` - Send a message

### Quick Chat
- `POST /chat` - Convenience endpoint (auto-creates session if needed)

## Usage Examples

### Quick Chat (Simplest)

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "user_id": "user-123"
  }'
```

### Full Flow

1. **Authenticate:**
   ```bash
   curl -X POST http://localhost:8000/auth/login \
     -H "Content-Type: application/json" \
     -d '{}'
   ```

2. **Create Session:**
   ```bash
   curl -X POST http://localhost:8000/sessions \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "user-123",
       "system_prompt": "You are a helpful assistant."
     }'
   ```

3. **Send Message:**
   ```bash
   curl -X POST http://localhost:8000/sessions/{session_uuid}/messages \
     -H "Content-Type: application/json" \
     -d '{
       "message": "What is the capital of France?"
     }'
   ```

## API Documentation

Once the server is running, access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Configuration

All configuration can be set via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | External API base URL | https://api.langxchange.ai |
| `COMPANY_ID` | Company identifier | demo-company-001 |
| `APP_UUID` | Application UUID | GMA73HIA1LSQ |
| `API_KEY` | API key | (configured) |
| `AGENT_UUID` | Default agent UUID | (configured) |
| `AUTH_EMAIL` | Authentication email | ext@demo.com |
| `AUTH_PASSWORD` | Authentication password | (configured) |
| `DEBUG` | Enable debug mode | false |

## License

MIT License
