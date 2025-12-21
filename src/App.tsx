

import "./styles/chat.css";
import "./styles/header.css";
import AppRouter from "./router/AppRouter";
import { WebSocketProvider } from "./services/WebSocketContext";

function App() {
  return (
    <WebSocketProvider>
      <AppRouter />
    </WebSocketProvider>
  );
}

export default App;