# GES PLC Mobile App

A modernized professional learning community (PLC) mobile web application for Ghana Education Service (GES) teachers. Built with React and Expo, featuring a professional dashboard, AI-powered teacher assistance, and rich content rendering.

## 🚀 Key Features

### 👨‍🏫 Teacher Intelligence & Profile
- **60-Teacher Dataset**: Integrated 60 pilot teachers with real school IDs, districts, and regions.
- **Class Assignment (Basic 1-9)**: Each teacher is assigned a specific class/grade level and relevant subjects.
- **Dynamic Profile Card**: Home dashboard displays a professional teacher ID card with role, school, class (Basic 1-9), and assigned subjects.
- **Profile Alerts**: Global system prompts teachers to complete their profile if class assignments are missing.

### 💬 AI-Powered PLC Assistant
- **Context-Aware Sessions**: Chatbot identifies the teacher by name, school, and class upon session entry.
- **Personalized Greetings**: AI assistant welcomes the teacher and offers subject-specific professional assistance.
- **Rich Content Rendering**:
    - **MarkDown**: Professional formatting for lesson plans, lists, and bold text.
    - **HTML/Code**: Interactive previews for structured content and code snippets.
    - **Dynamic Scaling**: Responsive chat width optimized for wide-screen web use.

### 📄 Export & Downloads
- **Multi-Format Export**: Export AI-generated content (e.g., lesson plans) to **PDF**, **TXT**, or **DOCX**.
- **In-Browser Downloads**: One-click download buttons on each message bubble for quick resource saving.

### 📋 Redesigned Activity & Sessions
- **Activity Screen**: (Formerly Approvals) Modernized to track **Agent Actions** (e.g., web searches, file reading) with one-click **Approve/Decline** flow.
- **Chat History**: List of active chat sessions with agent names, last messages, and timestamps.
- **Session Management**: Native-style **long-press to delete** support for managing chat history.

### 📅 Meeting & Resources
- **PLC Meetings**: Track upcoming and completed cluster sessions.
- **Resource Hub**: Upload and view documents, images, and teaching materials.
- **Voice Support**: Integrated voice recording and playback for asynchronous collaboration.

## 🛠 Technology Stack

- **React Native Web / Expo**: Cross-platform ready frontend.
- **React Router Native**: Seamless navigation between Home, Activity, Chats, and Settings.
- **Lucide React Native**: Premium SVG icons for a modern look.
- **Marked**: High-performance Markdown parser for the PLC Assistant.
- **Service API**: Integrated with `november-ai` backend for agent orchestration.

## 🏁 Getting Started

### Installation

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd ges-plc-frontend
   npm install
   ```

2. **Start Development**
   ```bash
   # Start the web version
   npm run web
   ```
   Navigate to `http://localhost:8081`

### Demo Login

The system uses phone-number based identification. Use any of the following pilot numbers:

- **Abena Owusu (Basic 3)**: `233244100002`
- **Kwame Mensah (Basic 2)**: `233244100001`
- **Kofi Agyemang (Basic 5)**: `233244100003`

## 📁 Project Structure

```
src/
├── components/
│   ├── Activity.js      # Redesigned activity/action tracker
│   ├── Chatbot.js       # The main PLC AI Assistant
│   ├── Chats.js         # Chat history and session management
│   ├── Home.js          # Teacher Dashboard with Profile Card
│   ├── Layout.js        # Bottom navigation and core layout
│   └── RichContentRenderer.js # Advanced Markdown/HTML/PDF engine
├── contexts/
│   ├── AuthContext.js   # Phone number & teacher dataset logic
│   └── ServiceContext.js # November AI backend credentials
├── data/
│   └── teachers.js      # The single source of truth for 60 teachers
└── utils/
    └── richContent.js   # Content parsing and export utilities
```

## 📜 Support & Documentation

This application is part of the GES Digital Transformation pilot. For technical details on the AI flow, refer to the [Agent Architecture Guide](./AGENT_ARCHITECTURE.md).