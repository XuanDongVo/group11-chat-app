import ChatPage from "./pages/ChatPage";
import Header from "./components/layout/Header";

import "./styles/chat.css";
import "./styles/header.css";

function App() {
  return (
    <div>
      <Header username="Trí Đức" onLogout={() => console.log("Logged out")} />
      <ChatPage />
    </div>
  );
}

export default App;
