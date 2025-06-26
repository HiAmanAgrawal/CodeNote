import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
  id?: string;
}

interface WebSocketOptions {
  url: string;
  protocols?: string | string[];
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  autoReconnect?: boolean;
  heartbeatInterval?: number;
}

interface WebSocketHook {
  connect: () => void;
  disconnect: () => void;
  send: (message: WebSocketMessage) => void;
  messages: WebSocketMessage[];
  isConnected: boolean;
  error: Event | null;
}

const useWebSocket = (options: WebSocketOptions): WebSocketHook => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(options.url, options.protocols);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      options.onOpen?.();
    };

    ws.onclose = () => {
      setIsConnected(false);
      options.onClose?.();
    };

    ws.onerror = (event) => {
      setError(event);
      options.onError?.(event);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
      options.onMessage?.(message);
    };
  }, [options]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    wsRef.current?.send(JSON.stringify(message));
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connect,
    disconnect,
    send,
    messages,
    isConnected,
    error,
  };
};

export default useWebSocket; 