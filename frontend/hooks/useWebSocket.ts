import { useEffect, useRef, useState, useCallback } from "react";

interface UseWebSocketOptions {
    onMessage?: (data: any) => void;
    reconnectInterval?: number;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    const connect = useCallback(() => {
        try {
            ws.current = new WebSocket(url);

            ws.current.onopen = () => {
                console.log("WebSocket Connected");
                setIsConnected(true);
            };

            ws.current.onclose = () => {
                console.log("WebSocket Disconnected");
                setIsConnected(false);
                // Auto-reconnect
                reconnectTimeout.current = setTimeout(() => {
                    connect();
                }, options.reconnectInterval || 3000);
            };

            ws.current.onmessage = (event) => {
                if (options.onMessage) {
                    try {
                        const data = JSON.parse(event.data);
                        options.onMessage(data);
                    } catch (e) {
                        console.error("WebSocket message parse error", e);
                    }
                }
            };
        } catch (e) {
            console.error("WebSocket connection error", e);
        }
    }, [url, options]);

    useEffect(() => {
        connect();
        return () => {
            ws.current?.close();
            clearTimeout(reconnectTimeout.current);
        };
    }, [connect]);

    return { isConnected };
}
