import "./styles/theme.css";
import "./styles/chat.css";
import "./styles/header.css";
import AppRouter from "./router/AppRouter";
import { WebSocketProvider } from "./services/WebSocketContext";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";

function App() {
  return (
    <ThemeProvider>
      <WebSocketProvider>
        <AppRouter />
      </WebSocketProvider>
    </ThemeProvider>
  );
}

export default App;