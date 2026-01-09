import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatLayout from "../components/layout/ChatLayout";
import { useChat } from "../hooks/useChat";
import { useAutoReLogin } from "../hooks/useAutoReLogin";
import Header from "../components/layout/Header";
import EffectsLayer from "../components/effects/EffectsLayer";
import type { EffectType } from "../types";
import { useSelector, useDispatch } from "react-redux";
import { selectUsername, selectIsAuthenticated, logout as logoutAction } from "../features/auth/authSlice";
import { wsService } from "../services/websocket";
import type { AppDispatch } from "../app/store";

interface ChatPageProps {
  onLogout?: () => void;
}

function ChatPage({ onLogout }: ChatPageProps) {
  const [effect, setEffect] = useState<EffectType>("snow");
  const [friendsRefreshTrigger, setFriendsRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const chat = useChat();
  const username = useSelector(selectUsername);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Tự động re-login sau 15s không hoạt động để duy trì session
  useAutoReLogin();

  // Redirect về login khi logout (từ auto re-login thất bại)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  const handleFriendsUpdate = () => {
    setFriendsRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <Header
        username={username || "User"}
        onLogout={handleLogout}
        onChangeEffect={setEffect}
        onFriendsUpdate={handleFriendsUpdate}
      />

      <EffectsLayer effect={effect} />

      <ChatLayout {...chat} friendsRefreshTrigger={friendsRefreshTrigger} />
    </>
  );
}

export default ChatPage;
