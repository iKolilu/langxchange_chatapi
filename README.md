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

## Running with Docker

1. **Build and start the container:**
   ```bash
   docker compose up -d --build
   ```

2. **Check logs:**
   ```bash
   docker compose logs -f
   ```

3. **Stop the service:**
   ```bash
   docker compose down
   ```

## Running Locally

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

4. **Run the Server:**
   ```bash
   # Development mode with auto-reload
   uvicorn main:app --reload --host 0.0.0.0 --port 8083
   
   # Or run directly
   python main.py
   ```

## API Endpoints

### Health & Info
- `GET /` - API information
- `GET /health` - Health check
- `GET /config/info` - Non-sensitive configuration info

### Authentication
- `POST /auth/login` - Authenticate with the external API (uses API Key + Company ID)
- `GET /auth/status` - Check authentication status

### Sessions
- `POST /sessions` - Create a new chat session

### Messages
- `POST /sessions/{session_uuid}/messages` - Send a message

### Quick Chat
- `POST /chat` - Convenience endpoint (auto-creates session if needed)

## Usage Examples

### Quick Chat (Simplest)

```bash
curl -X POST http://localhost:8083/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "user_id": "ext@demo.com"
  }'
```

### Full Flow

1. **Authenticate:**
   ```bash
   curl -X POST http://localhost:8083/auth/login \
     -H "Content-Type: application/json" \
     -d '{}'
   ```

2. **Create Session:**
   ```bash
   curl -X POST http://localhost:8083/sessions \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "ext@demo.com"
     }'
   ```

3. **Send Message:**
   ```bash
   curl -X POST http://localhost:8083/sessions/{session_uuid}/messages \
     -H "Content-Type: application/json" \
     -d '{
       "message": "What is the capital of France?"
     }'
   ```

## API Documentation

Once the server is running, access:
- **Swagger UI**: http://localhost:8083/docs
- **ReDoc**: http://localhost:8083/redoc

## Configuration

All configuration can be set via environment variables in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | External API base URL | https://api.langxchange.ai |
| `COMPANY_ID` | Company identifier | (configured) |
| `APP_UUID` | Application UUID | (configured) |
| `API_KEY` | API key (X-API-KEY) | (configured) |
| `AGENT_UUID` | Default agent UUID | (configured) |
| `DEBUG` | Enable debug mode | false |

## License

MIT License
