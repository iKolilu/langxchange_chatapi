# LangXchange Chat API & UI

A comprehensive toolkit for integrating and interacting with the **api.langxchange.ai** service. This project provides both a robust Python-based backend/CLI and a modern React-based frontend for real-time AI chat.

## 🏗️ Project Structure

The project follows a modular architecture for seamless backend/frontend development:

- **[backend/](file:///home/ikolilu-backend/dev/chat_api/backend)**: Core backend logic and management tools.
    - **[python/](file:///home/ikolilu-backend/dev/chat_api/backend/python)**: Parent directory for all Python microservices and core logic.
    - **[simple_chat_cli.py](file:///home/ikolilu-backend/dev/chat_api/backend/simple_chat_cli.py)**: The main interactive terminal interface for the LangXchange API.
    - **[langxchange_examples/](file:///home/ikolilu-backend/dev/chat_api/backend/python/langxchange_examples)**: A rich collection of usage patterns (RAG, Graph, MCP, etc.).
- **[frontend/react/](file:///home/ikolilu-backend/dev/chat_api/frontend/react)**: A premium web application that uses WebSockets for real-time, low-latency chat with AI agents.

---

## 🚀 Quick Start

### 1. Environment Setup
Both components follow a clean, secret-free pattern. All credentials must be provided via environment variables.

1.  **Configure Backend**:
    ```bash
    cp backend/python/.env.example .env
    # Edit .env and enter your Company ID, API Key, and Application ID
    ```

2.  **Configure Frontend**:
    Ensure `API_BASE_URL` in `src/services/api.ts` correctly points to your production or local instance.

---

### 2. Backend & CLI (Python)
The backend provides a terminal-based playground for testing authentication, session management, and streaming.

```bash
cd backend/python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run the interactive CLI (from the backend root)
python ../simple_chat_cli.py
```

**Key Features**:
*   ⚡ **Full Streaming**: Real-time character-by-character response display.
*   📊 **Live Metadata**: Real-time tracking of token usage and processing latency (ms).
*   🤖 **Session Management**: Easily create, resume, or delete chat sessions.
*   🛡️ **Security**: Hardened for production with all secrets moved to environment variables.

---

### 3. Frontend (React)
A modern, high-performance chat interface built with Vite, Framer Motion, and Tailwind-inspired aesthetics.

```bash
cd frontend/react
npm install
npm run dev
```

**Key Features**:
*   🌐 **Native WebSockets**: Bidirectional, low-latency communication for real-time chat.
*   🎨 **Premium Dark-Mode**: A state-of-the-art UI with smooth micro-animations.
*   📱 **Fully Responsive**: Optimized for both mobile and desktop experiences.
*   ⚡ **Streaming Support**: Character-level animation of responses for better UX.

---

## 🔌 Connecting to langxchange.ai

The application is fully compatible with the **LangXchange External Chat API**.

### Core Endpoints:
- **Auth**: `POST /exchat/auth/{company_id}/{app_uuid}`
- **Session**: `POST /exchat/{agent_uuid}/{app_uuid}/{user_id}/session`
- **Socket**: `ws://api.langxchange.ai/exchat/ws/{session_uuid}`
- **Delete**: `DELETE /exchat/session/{session_uuid}`

---

## 🔒 Security Best Practices

1.  **No Hardcoded Secrets**: All examples and source files have been purged of secrets. Use `.env` or system environment variables for `OPENAI_API_KEY`, `GOOGLE_API_KEY`, etc.
2.  **Bearer Authentication**: All requests require a valid JWT token obtained via the authentication endpoint.
3.  **Cross-Origin Isolation**: Ensure your production deployment restricts `CORS` to authorized domains.

---

## 📄 License
MIT License
