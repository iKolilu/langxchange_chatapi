import { useState, useEffect, useCallback, useRef } from 'react';

const WS_BASE_URL = 'wss://api.langxchange.ai';

export const useWebSocket = (sessionUuid: string | null, token: string | null) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const connect = useCallback(() => {
        if (!sessionUuid || !token) return;

        const wsUrl = `${WS_BASE_URL}/exchat/ws/${sessionUuid}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WS Connected');
            // Auth via the first message if required by backend pattern
            ws.send(JSON.stringify({ type: 'auth', token }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WS Message:', data);

            switch (data.type) {
                case 'connected':
                    setIsConnected(true);
                    setError(null);
                    break;
                case 'typing':
                    setIsTyping(data.status);
                    break;
                case 'content':
                    // Append to the last agent message or create new
                    setMessages(prev => {
                        const lastMsg = prev[prev.length - 1];
                        if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.isComplete) {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                ...lastMsg,
                                content: lastMsg.content + data.content
                            };
                            return updated;
                        } else {
                            return [...prev, { role: 'assistant', content: data.content, isComplete: false }];
                        }
                    });
                    break;
                case 'message':
                    // Final message with metadata
                    setMessages(prev => {
                        const updated = [...prev];
                        const lastIdx = updated.findLastIndex(m => m.role === 'assistant');
                        if (lastIdx !== -1) {
                            updated[lastIdx] = {
                                ...updated[lastIdx],
                                content: data.content,
                                isComplete: true,
                                tokens: data.tokens,
                                processingTime: data.processing_time_ms
                            };
                        }
                        return updated;
                    });
                    setIsTyping(false);
                    break;
                case 'error':
                    setError(data.message);
                    setIsTyping(false);
                    break;
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log('WS Closed');
        };

        ws.onerror = (err) => {
            console.error('WS Error:', err);
            setError('WebSocket connection error');
        };

        return () => ws.close();
    }, [sessionUuid, token]);

    useEffect(() => {
        const cleanup = connect();
        return () => cleanup && cleanup();
    }, [connect]);

    const sendMessage = useCallback((content: string) => {
        if (wsRef.current && isConnected) {
            const payload = {
                type: 'message',
                content,
                use_rag: true
            };
            wsRef.current.send(JSON.stringify(payload));
            setMessages(prev => [...prev, { role: 'user', content, timestamp: new Date().toISOString() }]);
        }
    }, [isConnected]);

    return { messages, isConnected, isTyping, error, sendMessage };
};
