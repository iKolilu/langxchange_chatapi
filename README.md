# LangXchange Chat API & UI

A comprehensive toolkit for integrating and interacting with the **api.langxchange.ai** service. This project provides both a robust Python-based backend/CLI and a modern React-based frontend for real-time AI chat.

## Project Structure

The project is organized into two main components:

- **[Backend (Python)](file:///home/ikolilu-backend/dev/chat_api/backend/python)**: Contains the FastAPI gateway and command-line tools for REST and Streaming interactions.
- **[Frontend (React)](file:///home/ikolilu-backend/dev/chat_api/frontend/react)**: A premium web application that uses WebSockets for real-time, low-latency chat with AI agents.

---

## 🛠️ Quick Start

### 1. Configuration
Both components use a shared configuration pattern. Initialize your environment variables:

```bash
cp backend/python/.env.example .env
# Edit .env with your credentials (API Key, Company ID, etc.)
```

**Target Service**: `https://api.langxchange.ai`

### 2. Backend & CLI (Python)
The backend provides a CLI tool for testing authentication, session management, and streaming.

```bash
cd backend/python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run the interactive CLI
python backend/simple_chat_cli.py
```

**Features**:
- 🚀 **Quick Start**: One-command auth, session creation, and chat.
- ⚡ **Streaming**: Real-time character streaming in the terminal.
- 📊 **Metadata**: Real-time display of tokens used and processing time.

### 3. Frontend (React)
A modern, high-performance chat interface built with Vite and Tailwind-inspired aesthetics.

```bash
cd frontend/react
npm install
npm run dev
```

**Features**:
- 🌐 **WebSockets**: Real-time bidirectional communication for low-latency chat.
- 🎨 **Premium UI**: Dark-mode primary design with smooth Framer Motion animations.
- 📱 **Responsive**: Fully optimized for mobile and desktop browsers.

---

## 🔌 Connecting to langxchange.ai

The application connects to the **LangXchange External Chat API**.

### Endpoints used:
- **Auth**: `POST /exchat/auth/{company_id}/{app_uuid}` (requires `x-api-key`)
- **Session**: `POST /exchat/{agent_uuid}/{app_uuid}/{user_id}/session`
- **Streaming (REST)**: `POST /exchat/{agent_uuid}/{app_uuid}/session/{session_uuid}/stream` (SSE)
- **Real-time (WebSocket)**: `ws://api.langxchange.ai/exchat/ws/{session_uuid}`

### Security
All requests require a valid **Bearer Token** obtained via the authentication endpoint. Ensure your `API_KEY` is kept secret and never exposed in public client-side code in production.

---

## 🏗️ Development

### Local API Proxy (Optional)
You can run the included FastAPI gateway to provide a simplified REST interface:
```bash
cd backend/python
uvicorn main:app --reload --port 8083
```
Documentation: [http://localhost:8083/docs](http://localhost:8083/docs)

---

## 📄 License
MIT License
