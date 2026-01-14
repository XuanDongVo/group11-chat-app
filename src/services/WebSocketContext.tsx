import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { wsService } from "./websocket";
import type { ServerMessage, WebSocketContextValue } from "../types";

const WebSocketContext = createContext<WebSocketContextValue>({
  isConnected: false,
  send: () => {},
  onMessage: () => () => {},
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(wsService.isConnected());

  useEffect(() => {
    let mounted = true;

    if (!wsService.isConnected()) {
      wsService
        .connect()
        .then(() => mounted && setIsConnected(true))
        .catch(() => mounted && setIsConnected(false));
    } else {
      setIsConnected(true);
    }

    return () => {
      mounted = false;
    };
  }, []);

    const send = useCallback((data: any) => {
      wsService.send(data);
    }, []);

    const onMessage = useCallback((handler: (message: ServerMessage) => void) => {
      return wsService.onMessage(handler);
    }, []);

    const value = useMemo(() => ({ isConnected, send, onMessage }), [isConnected, send, onMessage]);

  return (
    <WebSocketContext.Provider
      value={
        value
      }
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
