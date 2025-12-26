import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatLayout from "../components/layout/ChatLayout";
import { useChat } from "../hooks/useChat";
import Header from "../components/layout/Header";
import EffectsLayer from "../components/effects/EffectsLayer";
import type { EffectType } from "../types";

interface ChatPageProps {
  onLogout?: () => void;
}

function ChatPage({ onLogout }: ChatPageProps) {
  const [effect, setEffect] = useState<EffectType>("snow");
  const navigate = useNavigate();
  const chat = useChat();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  return (
    <>
      <Header
        username="User"
        onLogout={handleLogout}
        onChangeEffect={setEffect}
      />

      <EffectsLayer effect={effect} />

      <ChatLayout {...chat} />
    </>
  );
}

export default ChatPage;
