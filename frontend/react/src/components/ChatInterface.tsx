import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2, Info } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { api } from '../services/api';

const ChatInterface: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [session, setSession] = useState<any>(null);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Default demo credentials (can be replaced with a login form later)
    const CONFIG = {
        companyId: "demo-company-001",
        appId: "GMA73HIA1LSQ",
        apiKey: "nv_5fV_hQa6q2OVOExP6ykQxxojYRjAGgzDL6BjMROq8jY",
        agentId: "f548d5fd-05a7-4d7f-9d31-00b9fedf70b1",
        userId: "ext@demo.com"
    };

    const { messages, isConnected, isTyping, error, sendMessage } = useWebSocket(
        session?.session_uuid || null,
        token
    );

    useEffect(() => {
        const initChat = async () => {
            setIsLoading(true);
            try {
                const auth = await api.authenticate(CONFIG.companyId, CONFIG.appId, CONFIG.apiKey);
                setToken(auth.access_token);

                const sess = await api.createSession(
                    auth.access_token,
                    CONFIG.agentId,
                    CONFIG.appId,
                    CONFIG.userId
                );
                setSession(sess);
            } catch (err) {
                console.error('Initialization error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initChat();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim() && isConnected) {
            sendMessage(inputMessage.trim());
            setInputMessage('');
        }
    };

    if (isLoading) {
        return (
            <div className="chat-container items-center justify-center">
                <Loader2 className="animate-spin text-primary w-12 h-12" />
                <p className="mt-4 text-text-muted">Initializing premium chat experience...</p>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <header className="chat-header">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Bot className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">{session?.agent_name || 'AI Assistant'}</h1>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-xs text-text-muted">{isConnected ? 'Connected' : 'Offline'}</span>
                        </div>
                    </div>
                </div>
                <button className="p-2 text-text-muted hover:text-white transition-colors">
                    <Info size={20} />
                </button>
            </header>

            <main className="chat-main">
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role === 'user' ? 'user' : 'agent'}`}>
                        <div className="flex gap-3">
                            {msg.role === 'assistant' && <Bot size={18} className="mt-1 flex-shrink-0" />}
                            <div>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                {msg.isComplete && (msg.tokens || msg.processingTime) && (
                                    <div className="metadata">
                                        {msg.tokens && <span>{msg.tokens} tokens</span>}
                                        {msg.processingTime && <span>{msg.processingTime.toFixed(0)}ms</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="typing">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                    </div>
                )}
                <div ref={chatEndRef} />
            </main>

            <footer className="chat-footer">
                {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
                <form onSubmit={handleSend} className="input-wrapper">
                    <input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={!isConnected}
                    />
                    <button type="submit" className="send-btn" disabled={!isConnected || !inputMessage.trim()}>
                        <Send size={20} />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatInterface;
