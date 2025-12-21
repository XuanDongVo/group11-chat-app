import { useState } from "react";
import ChatLayout from "../components/layout/ChatLayout";
import Header from "../components/layout/Header";
import EffectsLayer from "../components/effects/EffectsLayer";
import type { EffectType } from "../types";

function ChatPage() {
  const [effect, setEffect] = useState<EffectType>("snow");

  return (
    <>
      <Header
        username="User"
        onLogout={() => {}}
        onChangeEffect={setEffect}
      />

      <EffectsLayer effect={effect} />

      <ChatLayout />
    </>
  );
}

export default ChatPage;
