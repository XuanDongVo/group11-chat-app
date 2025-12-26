import { createContext, useContext, useEffect, useState } from "react";
import { wsService } from "./websocket";

export type ServerMessage = {
  event: string;
  data?: any;
};

interface WebSocketContextValue {
  isConnected: boolean;
  send: (data: any) => void;
  onMessage: (handler: (message: ServerMessage) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  isConnected: false,
  send: () => {},
  onMessage: () => {},
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

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        send: wsService.send.bind(wsService),
        onMessage: wsService.onMessage.bind(wsService),
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
