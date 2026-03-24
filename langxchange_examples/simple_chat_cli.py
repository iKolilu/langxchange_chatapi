#!/usr/bin/env python3
"""
Simple Interactive Chat CLI

A command-line interface for creating chat sessions and interacting with the backend.
"""

import requests
import json
import sys
import os
import asyncio
import websockets
from datetime import datetime

class SimpleChatCLI:
    def __init__(self):
        self.base_url = "https://api.langxchange.ai"
        self.access_token = None
        self.session_data = None
        
        # Configuration
        self.company_id = "demo-company-001"
        self.app_uuid = "GMA73HIA1LSQ"
        self.api_key = "nv_Uwx3h8PWalTyFAYT_KCNErXrEO_NEgZcMLXcMMa4IbA"
        self.agent_uuid = "f548d5fd-05a7-4d7f-9d31-00b9fedf70b1"
        self.user_id = "user1@ges.com"
        
        # Internal API authentication credentials
        self.email = "user1@ges.com"
        self.password = "p@55w0rd"
        
        self.use_agentid_messaging = True  # Use process_message_with_agentid instead of regular messaging
        self.external_chat_mode = True  # Use external chat endpoints vs internal API
        
    def print_header(self, text):
        """Print a formatted header"""
        print(f"\n{'='*50}")
        print(f"🤖 {text}")
        print(f"{'='*50}")
        
    def print_success(self, text):
        """Print success message"""
        print(f"✅ {text}")
        
    def print_error(self, text):
        """Print error message"""
        print(f"❌ {text}")
        
    def print_info(self, text):
        """Print info message"""
        print(f"ℹ️  {text}")
        
    def authenticate(self):
        """Authenticate with the backend"""
        self.print_header("Authentication")
        print(f"Authenticating with backend...")
        print(f"   Base URL: {self.base_url}")
        print(f"   Company ID: {self.company_id}")
        print(f"   App UUID: {self.app_uuid}")
        print(f"   Mode: {'External Chat' if self.external_chat_mode else 'Internal API'}")
        
        if self.external_chat_mode:
            # External chat authentication
            url = f"{self.base_url}/exchat/auth/{self.company_id}/{self.app_uuid}"
            headers = {"x-api-key": self.api_key}
            auth_data = None
        else:
            # Internal API authentication using email/password
            url = f"{self.base_url}/api/auth/login"
            headers = {"Content-Type": "application/json"}
            auth_data = {
                "email": self.email,
                "password": self.password
            }
        
        try:
            if auth_data:
                # Internal API with JSON data
                response = requests.post(url, headers=headers, json=auth_data)
            else:
                # External chat with headers only
                response = requests.post(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                self.access_token = data["access_token"]
                self.print_success(f"Authentication successful!")
                print(f"   Token: {self.access_token[:20]}...")
                
                # Show different info based on auth type
                if self.external_chat_mode:
                    print(f"   App: {data.get('app_name', 'N/A')}")
                    print(f"   Company: {data.get('company_id', 'N/A')}")
                    print(f"   Expires: {data.get('expires_in', 'N/A')} seconds")
                else:
                    print(f"   Type: Bearer Token")
                    print(f"   User: {self.email}")
                
                return True
            else:
                self.print_error(f"Authentication failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            self.print_error(f"Authentication error: {str(e)}")
            return False
    
    def list_agents(self):
        """List all available agents for the current application"""
        if not self.access_token:
            self.print_error("Not authenticated. Please authenticate first.")
            return None
            
        self.print_header("Available Agents")
        print(f"Fetching agents for application...")
        
        # Use exchat if in external mode, though this method is currently shared
        if self.external_chat_mode:
            url = f"{self.base_url}/exchat/agents"
        else:
            url = f"{self.base_url}/api/agents"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                agents = response.json()
                if not agents:
                    self.print_info("No agents found.")
                    return []
                
                # Display agents in a table-like format
                print(f"{'#':<3} | {'Name':<25} | {'Agent UUID':<36} | {'Description'}")
                print("-" * 100)
                for i, agent in enumerate(agents):
                    name = agent.get('name', 'N/A')
                    uuid = agent.get('agent_uuid', 'N/A')
                    desc = agent.get('description', '')
                    if not desc:
                        desc = ""
                    if len(desc) > 30:
                        desc = desc[:27] + "..."
                    print(f"{i+1:<3} | {name:<25} | {uuid:<36} | {desc}")
                
                return agents
            else:
                self.print_error(f"Failed to fetch agents: {response.status_code}")
                print(f"   Response: {response.text}")
                return None
                
        except Exception as e:
            self.print_error(f"Error fetching agents: {str(e)}")
            return None

    def select_agent(self):
        """Interactive agent selection"""
        agents = self.list_agents()
        if not agents:
            return False
            
        try:
            choice = input(f"\nSelect agent number (1-{len(agents)}) or press Enter to cancel: ").strip()
            if not choice:
                return False
                
            idx = int(choice) - 1
            if 0 <= idx < len(agents):
                selected = agents[idx]
                self.agent_uuid = selected['agent_uuid']
                self.print_success(f"Selected agent: {selected['name']} ({self.agent_uuid})")
                return True
            else:
                self.print_error("Invalid selection.")
                return False
        except ValueError:
            self.print_error("Please enter a valid number.")
            return False
    
    def create_session(self):
        """Create a new chat session"""
        if not self.access_token:
            self.print_error("Not authenticated. Please authenticate first.")
            return False
            
        self.print_header("Session Creation")
        
        # Get user preferences
        print("Session Configuration:")
        print(f"   Mode: {'External Chat' if self.external_chat_mode else 'Internal API'}")
        
        # System prompt (only for external chat)
        system_prompt = "You are a helpful AI assistant. Please provide clear, concise, and helpful responses."
        if self.external_chat_mode:
            system_prompt = input(f"System prompt [{system_prompt[:50]}...]: ").strip() or system_prompt
        
        # User ID
        default_user_id = self.user_id
        user_id = input(f"User ID [{default_user_id}]: ").strip()
        if not user_id:
            user_id = default_user_id
        
        self.user_id = user_id  # Update default

        # Agent ID selection
        print(f"Current Agent: {self.agent_uuid}")
        change_agent = input("Change agent? (y/N/list): ").strip().lower()
        if change_agent == 'list':
            self.select_agent()
        elif change_agent in ['y', 'yes']:
            new_agent = input(f"New Agent UUID [{self.agent_uuid}]: ").strip()
            if new_agent:
                self.agent_uuid = new_agent
                print(f"✅ Updated Agent UUID to: {self.agent_uuid}")
            
        # print(f"\nCreating session with:")
        # print(f"   Agent UUID: {self.agent_uuid}")
        # print(f"   User ID: {user_id}")
        # print(f"   System Prompt: {system_prompt[:100]}{'...' if len(system_prompt) > 100 else ''}")
        
        if self.external_chat_mode:
            # External chat session creation
            session_data = {
                "system_prompt": system_prompt,
                "user_id": user_id,
                "user_prompt": "Hello, I just started a new chat session.",
                "use_fileconfig": False,
                "use_ddbconfig": False,
                "use_vectorconfig": True,
                "use_mcpconfig": False,
                "use_remote_storage": False
            }
            
            url = f"{self.base_url}/exchat/{self.agent_uuid}/{self.app_uuid}/{self.user_id}/session"
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
        else:
            # Internal API session creation using create_agent_session
            session_data = {
                "title": f"Chat with Agent {self.agent_uuid}",
                "use_rag": True,
                "vector_config_id": None # Let backend decide or use agent default
            }
            url = f"{self.base_url}/api/chat/agent/{self.agent_uuid}/sessions"
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
        
        try:
            response = requests.post(url, headers=headers, json=session_data)
            
            if response.status_code == 200:
                data = response.json()
                self.session_data = data
                # print({data})
                self.print_success(f"Session created successfully!")
                print(f"   Session ID: {data['session_id']}")
                print(f"   Session UUID: {data['session_uuid']}")
                print(f"   Agent: {data['agent_name']}")
                print(f"   Agent UUID: {self.agent_uuid}")
                print(f"   Status: {data.get('status', 'N/A')}")
                
                # Show LLM configuration information if available in response
                if 'llm_config' in data:
                    llm_config = data['llm_config']
                    print(f"   LLM Provider: {llm_config.get('provider', 'N/A')}")
                    print(f"   Model: {llm_config.get('model', 'N/A')}")
                    if 'temperature' in llm_config:
                        print(f"   Temperature: {llm_config['temperature']}")
                    if 'max_tokens' in llm_config:
                        print(f"   Max Tokens: {llm_config['max_tokens']}")
                
                # Show configuration usage if available
                if 'configurations_used' in data:
                    configs = data['configurations_used']
                    print(f"   RAG Enabled: {'✅' if configs.get('vector_config') else '❌'}")
                    print(f"   File Config: {'✅' if configs.get('file_config') else '❌'}")
                    print(f"   DB Config: {'✅' if configs.get('database_config') else '❌'}")
                    print(f"   MCP Config: {'✅' if configs.get('mcp_config') else '❌'}")
                
                return True
            else:
                self.print_error(f"Session creation failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            self.print_error(f"Session creation error: {str(e)}")
            return False
    
    def send_message(self, message):
        """Send a message to the chat session"""
        if not self.session_data:
            self.print_error("No active session. Please create a session first.")
            return None
            
        session_uuid = self.session_data['session_uuid']
        
        if self.external_chat_mode:
            # External chat endpoint
            url = f"{self.base_url}/exchat/{self.agent_uuid}/{self.app_uuid}/session/{session_uuid}/message"
            message_data = {
                "message": message
            }
        else:
            # Internal API endpoints
            url = f"{self.base_url}/api/chat/sessions/{session_uuid}/messages"
            message_data = {
                "message": message,
                "use_rag": True
            }
        
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

        # self.print_error(f"Message sending failed: { message_data  } { url }")
        # print(f"   Response: {response.text}")
        # print(f"   URL: {url}")  # Debug info
        # return None
        
        try:
            response = requests.post(url, headers=headers, json=message_data)
            
            if response.status_code == 200:
                
                return response.json()
            else:
                self.print_error(f"Message sending failed: {response.status_code}")
                print(f"   Response: {response.text}")
                print(f"   URL: {url}")  # Debug info
                return None
                
        except Exception as e:
            self.print_error(f"Message sending error: {str(e)}")
            return None
    
    def get_session_status(self):
        """Get current session status"""
        if not self.session_data:
            return None
            
        session_uuid = self.session_data['session_uuid']
        url = f"{self.base_url}/exchat/{self.agent_uuid}/{self.app_uuid}/session/{session_uuid}"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                return response.json()
            else:
                self.print_error(f"Status check failed: {response.status_code}")
                return None
                
        except Exception as e:
            self.print_error(f"Status check error: {str(e)}")
            return None
    
    def interactive_chat(self):
        """Start interactive chat mode"""
        if not self.session_data:
            self.print_error("No active session. Please create a session first.")
            return
            
        self.print_header("Interactive Chat Mode")
        print(f"Session: {self.session_data['session_uuid']}")
        print(f"Agent: {self.session_data['agent_name']}")
        print("Type your messages below. Commands:")
        print("  /status - Show session status")
        print("  /quit - Exit chat mode")
        print("  /help - Show this help")
        print()
        print("💡 Tips:")
        print("  • Be specific in your questions for better responses")
        print("  • Try asking about the agent's capabilities")
        print("  • Use /status to see session details")
        print("="*50)
        
        while True:
            try:
                user_input = input(f"\n💬 You: ").strip()
                
                if not user_input:
                    continue
                    
                # Handle commands
                if user_input.startswith('/'):
                    command = user_input.lower()
                    
                    if command == '/quit':
                        self.print_info("Exiting chat mode...")
                        break
                    elif command == '/status':
                        status = self.get_session_status()
                        if status:
                            print(f"📊 Session Status:")
                            print(f"   Status: {status.get('status', 'N/A')}")
                            print(f"   Created: {status.get('created_at', 'N/A')}")
                            print(f"   Updated: {status.get('updated_at', 'N/A')}")
                            if 'system_prompt' in status:
                                print(f"   System Prompt: {len(status['system_prompt'])} chars")
                        else:
                            self.print_error("Failed to get session status")
                    elif command == '/help':
                        print("📋 Available Commands:")
                        print("  /status - Show session status")
                        print("  /quit - Exit chat mode")
                        print("  /help - Show this help")
                    else:
                        self.print_error(f"Unknown command: {command}")
                        print("Type /help for available commands.")
                    continue
                
                # Send message
                processing_method = "agentid" if self.use_agentid_messaging else "standard"
                print(f"🤖 Agent: [Processing with {processing_method} method using LLM config from {self.agent_uuid}...]")
                response = self.send_message(user_input)
                
                if response:
                    # Display the main response
                    if 'response' in response and response['response']:
                        print(f"🤖 Agent: {response['response']}")
                    elif 'message' in response:
                        print(f"🤖 Agent: {response['message']}")
                    elif response.get('response') == "":
                        print("🤖 Agent: [Received empty response]")
                    else:
                        print(f"🤖 Agent: [Response received]")
                        print(json.dumps(response, indent=2))
                    
                    # Display additional metadata if available
                    metadata = []
                    if 'processing_time_ms' in response:
                        metadata.append(f"Time: {response['processing_time_ms']:.0f}ms")
                    if 'tokens_used' in response and response['tokens_used'] > 0:
                        metadata.append(f"Tokens: {response['tokens_used']}")
                    if 'timestamp' in response:
                        # Extract just the time part from timestamp
                        try:
                            from datetime import datetime
                            dt = datetime.fromisoformat(response['timestamp'].replace('Z', '+00:00'))
                            metadata.append(f"Time: {dt.strftime('%H:%M:%S')}")
                        except:
                            pass
                    
                    if metadata:
                        print(f"📊 {' | '.join(metadata)}")
                        
                else:
                    print("🤖 Agent: [Failed to send message]")
                    
            except KeyboardInterrupt:
                print("\n\n👋 Chat interrupted. Returning to main menu...")
                break
            except Exception as e:
                self.print_error(f"Chat error: {str(e)}")
                break
    
    async def websocket_chat_loop(self):
        """Async loop for WebSocket chat"""
        if not self.session_data:
            self.print_error("No active session. Please create a session first.")
            return

        session_uuid = self.session_data['session_uuid']
        # Construct WebSocket URL
        ws_scheme = "ws" if not self.base_url.startswith("https") else "wss"
        ws_host = self.base_url.split("://")[1]
        ws_url = f"{ws_scheme}://{ws_host}/api/chat/ws/{session_uuid}"
        
        self.print_header("WebSocket Chat Mode")
        print(f"Connecting to: {ws_url}")
        print("Type your messages below. Commands:")
        print("  /quit - Exit chat mode")
        print("="*50)

        try:
            # Use a longer timeout for the initial connection
            async with websockets.connect(ws_url, ping_interval=20, ping_timeout=20) as websocket:
                # 1. Authenticate
                auth_payload = {
                    "type": "auth",
                    "token": self.access_token
                }
                await websocket.send(json.dumps(auth_payload))
                
                # Wait for connection confirmation
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                    data = json.loads(response)
                except asyncio.TimeoutError:
                    self.print_error("WebSocket Auth Timeout: No response from server")
                    return
                
                if data.get("type") == "error":
                    self.print_error(f"WebSocket Auth Failed: {data.get('message')}")
                    return
                
                if data.get("type") == "connected":
                    self.print_success("WebSocket Connected!")
                
                # Start input loop
                while True:
                    # Get user input (blocking, but okay for CLI)
                    # Note: In a real async CLI we might use aioconsole
                    try:
                        user_input = await asyncio.get_event_loop().run_in_executor(None, input, "\n💬 You: ")
                    except EOFError:
                        break
                        
                    user_input = user_input.strip()
                    
                    if not user_input:
                        continue
                        
                    if user_input.lower() == '/quit':
                        break
                    
                    # Send message
                    msg_payload = {
                        "type": "message",
                        "content": user_input,
                        "use_rag": True
                    }
                    await websocket.send(json.dumps(msg_payload))
                    
                    # Wait for response(s)
                    while True:
                        try:
                            response = await websocket.recv()
                            data = json.loads(response)
                        except websockets.exceptions.ConnectionClosed:
                            self.print_error("WebSocket Connection Closed")
                            return
                        
                        if data.get("type") == "typing":
                            if data.get("status"):
                                print("🤖 Agent is typing...", end="\r", flush=True)
                            else:
                                print(" " * 30, end="\r", flush=True) # Clear typing line
                                
                        elif data.get("type") == "message":
                            print(f"🤖 Agent: {data.get('content')}")
                            
                            # Show metadata
                            metadata = []
                            if 'processing_time_ms' in data:
                                metadata.append(f"Time: {data['processing_time_ms']:.0f}ms")
                            if 'tokens' in data and data['tokens'] > 0:
                                metadata.append(f"Tokens: {data['tokens']}")
                            
                            if metadata:
                                print(f"📊 {' | '.join(metadata)}")
                            break # Done with this message turn
                            
                        elif data.get("type") == "error":
                            self.print_error(f"Error: {data.get('message')}")
                            break
                        
                        elif data.get("type") == "pong":
                            continue # Ignore pongs

        except Exception as e:
            self.print_error(f"WebSocket Error: {str(e)}")

    def start_websocket_chat(self):
        """Wrapper to run async websocket chat"""
        if self.external_chat_mode:
            self.print_error("WebSocket chat is only available in Internal API mode.")
            return
            
        try:
            asyncio.run(self.websocket_chat_loop())
        except KeyboardInterrupt:
            print("\n\n👋 Chat interrupted.")
        except Exception as e:
            self.print_error(f"Failed to start WebSocket chat: {str(e)}")

    def quick_start(self):
        """Quick start - full workflow in one go"""
        self.print_header("Quick Start")
        print("This will authenticate, create a session, and start chatting.")
        
        # Authenticate
        if not self.authenticate():
            return False
            
        # Create session
        if not self.create_session():
            return False
            
        # Start chat
        self.print_success("Ready! Starting interactive chat...")
        self.interactive_chat()
        return True
    
    def show_menu(self):
        """Show main menu"""
        self.print_header("Simple Chat CLI")
        print("What would you like to do?")
        print("1. 🚀 Quick Start (Auth + Session + Chat)")
        print("2. 🔐 Authenticate")
        print("3. 📋 List & Select Agent")
        print("4. 💬 Create Session")
        print("5. 💭 Start Chat (REST)")
        print("6. ⚡ Start Chat (WebSocket)")
        print("7. 📊 Show Session Status")
        print("8. 🔧 Configuration")
        print("9. ❌ Exit")
        
        choice = input("\nSelect option (1-9): ").strip()
        return choice
    
    def show_config(self):
        """Show current configuration"""
        self.print_header("Configuration")
        print(f"Base URL: {self.base_url}")
        print(f"Company ID: {self.company_id}")
        print(f"App UUID: {self.app_uuid}")
        print(f"Agent UUID: {self.agent_uuid}")
        
        # Show auth credentials based on mode
        if self.external_chat_mode:
            print(f"API Key: {self.api_key[:10]}...")
        else:
            print(f"Email: {self.email}")
            print(f"Password: {'***' if self.password != '***' else '***'}")
        
        print(f"Access Token: {self.access_token[:20] + '...' if self.access_token else 'Not set'}")
        
        # Show messaging method
        messaging_method = "AgentID-based (process_message_with_agentid)" if self.use_agentid_messaging else "Standard (process_message)"
        print(f"Messaging Method: {messaging_method}")
        
        # Show chat mode
        chat_mode = "External Chat" if self.external_chat_mode else "Internal API"
        print(f"Chat Mode: {chat_mode}")
        print(f"User ID: {self.user_id}")
        
        if self.session_data:
            print(f"\nActive Session:")
            print(f"Session UUID: {self.session_data['session_uuid']}")
            print(f"User ID: {self.session_data['user_id']}")
            print(f"Agent: {self.session_data['agent_name']}")
        else:
            print("\nNo active session")
    
    def get_agent_config(self):
        """Get and display agent LLM configuration information"""
        if not self.access_token:
            self.print_error("Not authenticated. Please authenticate first.")
            return False
        
        self.print_header("Agent LLM Configuration")
        print(f"Agent UUID: {self.agent_uuid}")
        print("Fetching agent configuration...")
        
        # We can't directly get agent config without a session, but we can show
        # that the system will use the agent's LLM configuration when creating sessions
        print("\n💡 When you create a session, the system will:")
        print(f"   • Use the LLM configuration attached to agent {self.agent_uuid}")
        print("   • Apply provider-specific settings (OpenAI, Anthropic, etc.)")
        print("   • Use configured model, temperature, max_tokens")
        print("   • Apply custom system prompts if set")
        print("   • Enable RAG if vector configuration is available")
        
        print("\n🔧 Available configuration parameters:")
        print("   • Provider: OpenAI, Anthropic, DeepSeek, Google")
        print("   • Model: Configurable per provider")
        print("   • Temperature: Controls response randomness (0.0-2.0)")
        print("   • Max Tokens: Maximum response length")
        print("   • System Prompt: Custom instructions for the agent")
        print("   • API Key & Base URL: Custom endpoint configuration")
        
        print(f"\n📝 To update agent configuration, contact your administrator")
        print(f"   and provide the agent UUID: {self.agent_uuid}")
        
        return True
    
    def update_config(self):
        """Update configuration"""
        self.print_header("Update Configuration")
        
        configs = [
            ("Base URL", "base_url", self.base_url),
            ("Company ID", "company_id", self.company_id),
            ("App UUID", "app_uuid", self.app_uuid),
            ("Agent UUID", "agent_uuid", self.agent_uuid),
        ]
        
        # Add auth-specific configs based on mode
        if self.external_chat_mode:
            configs.append(("API Key", "api_key", self.api_key))
        else:
            configs.append(("Email", "email", self.email))
            configs.append(("Password", "password", "***"))
        
        print("Current configuration values. Press Enter to keep current value:")
        
        for label, attr, current in configs:
            new_value = input(f"{label} [{current}]: ").strip()
            if new_value:
                setattr(self, attr, new_value)
                print(f"✅ Updated {label}")
        
        # Update messaging method
        current_method = "AgentID-based" if self.use_agentid_messaging else "Standard"
        print(f"\nCurrent messaging method: {current_method}")
        use_agentid = input("Use AgentID-based messaging? (y/N): ").strip().lower()
        if use_agentid in ['y', 'yes']:
            self.use_agentid_messaging = True
            print("✅ Updated to AgentID-based messaging")
        elif use_agentid in ['n', 'no', '']:
            self.use_agentid_messaging = False
            print("✅ Updated to standard messaging")
        
        # Update chat mode
        current_mode = "External Chat" if self.external_chat_mode else "Internal API"
        print(f"\nCurrent chat mode: {current_mode}")
        use_external = input("Use External Chat mode? (Y/n): ").strip().lower()
        if use_external in ['', 'y', 'yes']:
            self.external_chat_mode = True
            print("✅ Updated to External Chat mode")
        elif use_external in ['n', 'no']:
            self.external_chat_mode = False
            print("✅ Updated to Internal API mode")
    
    def run(self):
        """Main application loop"""
        self.print_header("Welcome to Simple Chat CLI!")
        print("A simple command-line interface for chatting with AI agents.")
        print("This tool handles authentication, session creation, and messaging.")
        print(f"Backend: {self.base_url}")
        print(f"Agent: {self.agent_uuid}")
        
        # Quick connection test
        try:
            import urllib.request
            with urllib.request.urlopen(f"{self.base_url}/docs", timeout=2) as response:
                print("✅ Backend connection: OK")
        except:
            print("❌ Backend connection: Failed - Make sure backend is running on port 8000")
            print("   Run: cd november && python -m uvicorn main:app --reload --port 8000")
            print()
        
        while True:
            try:
                choice = self.show_menu()
                
                if choice == "1":
                    self.quick_start()
                    
                elif choice == "2":
                    if self.authenticate():
                        self.print_success("Ready to create sessions!")
                    
                elif choice == "3":
                    self.select_agent()

                elif choice == "4":
                    if self.create_session():
                        self.print_success("Session ready for chat!")
                    
                elif choice == "5":
                    self.interactive_chat()

                elif choice == "6":
                    self.start_websocket_chat()
                    
                elif choice == "7":
                    if self.session_data:
                        status = self.get_session_status()
                        if status:
                            self.print_header("Session Status")
                            print(f"Status: {status.get('status', 'N/A')}")
                            print(f"Created: {status.get('created_at', 'N/A')}")
                            print(f"Updated: {status.get('updated_at', 'N/A')}")
                            print(f"Agent: {status.get('agent_name', 'N/A')}")
                            print(f"Session ID: {status.get('session_id', 'N/A')}")
                            if 'system_prompt' in status:
                                print(f"System Prompt: {len(status['system_prompt'])} chars")
                    else:
                        self.print_error("No active session")
                        
                elif choice == "8":
                    while True:
                        print("\nConfiguration Menu:")
                        print("1. View Configuration")
                        print("2. Update Configuration") 
                        print("3. Show Agent LLM Configuration")
                        print("4. Back to Main Menu")
                        
                        config_choice = input("Select option (1-4): ").strip()
                        
                        if config_choice == "1":
                            self.show_config()
                        elif config_choice == "2":
                            self.update_config()
                        elif config_choice == "3":
                            self.get_agent_config()
                        elif config_choice == "4":
                            break
                        else:
                            self.print_error("Invalid choice")
                    
                elif choice == "9":
                    self.print_header("Goodbye!")
                    print("Thanks for using Simple Chat CLI! 👋")
                    break
                    
                else:
                    self.print_error("Invalid choice. Please select 1-9.")
                    
            except KeyboardInterrupt:
                print("\n\n👋 Goodbye! Exiting...")
                break
            except Exception as e:
                self.print_error(f"Unexpected error: {str(e)}")
                input("Press Enter to continue...")

def main():
    """Main function"""
    cli = SimpleChatCLI()
    cli.run()

if __name__ == "__main__":
    main()