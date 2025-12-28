import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatLayout from "../components/layout/ChatLayout";
import { useChat } from "../hooks/useChat";
import Header from "../components/layout/Header";
import EffectsLayer from "../components/effects/EffectsLayer";
import type { EffectType } from "../types";
import { useSelector, useDispatch } from "react-redux";
import { selectUsername, logout as logoutAction } from "../features/auth/authSlice";
import { wsService } from "../services/websocket";
import type { AppDispatch } from "../app/store";

interface ChatPageProps {
  onLogout?: () => void;
}

function ChatPage({ onLogout }: ChatPageProps) {
  const [effect, setEffect] = useState<EffectType>("snow");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const chat = useChat();
  const username = useSelector(selectUsername);

  // Phục hồi room/cuộc trò chuyện hiện tại sau khi F5
  useEffect(() => {
    const savedRoomId = localStorage.getItem('currentRoomId');
    if (savedRoomId && chat.selectUser) {
      // Đợi một chút để đảm bảo userList đã được load
      setTimeout(() => {
        chat.selectUser(savedRoomId);
      }, 500);
    }
  }, []);

  // Lưu room hiện tại khi thay đổi
  useEffect(() => {
    if (chat.currentUser) {
      localStorage.setItem('currentRoomId', chat.currentUser);
    }
  }, [chat.currentUser]);

  const handleLogout = () => {
    // Gọi WebSocket logout để xóa session server-side
    wsService.logout();
    
    // Clear Redux state
    dispatch(logoutAction());
    
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  return (
    <>
      <Header
        username={username || "User"}
        onLogout={handleLogout}
        onChangeEffect={setEffect}
      />

      <EffectsLayer effect={effect} />

      <ChatLayout {...chat} />
    </>
  );
}

export default ChatPage;
