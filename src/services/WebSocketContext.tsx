import { createContext, useContext, useEffect, useState } from 'react';
import { wsService } from './websocket';

interface WebSocketContextValue {
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue>({ isConnected: false });

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(wsService.isConnected());

  useEffect(() => {
    let mounted = true;
    if (!wsService.isConnected()) {
      wsService.connect().then(() => {
        if (mounted) setIsConnected(true);
      }).catch(() => {
        if (mounted) setIsConnected(false);
      });
    } else {
      setIsConnected(true);
    }
    return () => { mounted = false; };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
