import Sidebar from "./Sidebar";
import ChatHeader from "../../features/chat/components/ChatHeader";
import MessageList from "../../features/chat/components/MessageList";
import ChatInput from "../../features/chat/components/ChatInput";

import type { ChatLayoutProps } from "../../types/chat";
import { useState } from "react";

export default function ChatLayout({
  userList,
  loadingUsers,
  currentUser,
  messages,
  loadingMessages,
  selectUser,
  sendToUser,
  checkUserExist,
  searchUsers,
  searchLoading,
  getRoomChatMessages,
  sendChatRoom,
  joinRoom, // nhận từ useChat()
  friendsRefreshTrigger,
}: ChatLayoutProps & {
  searchUsers: { name: string; avatar?: string }[];
  searchLoading: boolean;
  getRoomChatMessages: (roomName: string) => void;
  sendChatRoom: (roomName: string, message: string) => void;
  joinRoom: (roomName: string) => void;
  friendsRefreshTrigger?: number;
}) {
  const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");
  const handleTabChange = (tab: "friends" | "groups") => setActiveTab(tab);

  const loggedInUser = localStorage.getItem("username") || "";

  const handleSelect = (name: string) => {
    if (activeTab === "friends") {
      selectUser(name);
    } else {
      joinRoom(name);
      getRoomChatMessages(name);
    }
  };

  const handleSend = (text: string) => {
    if (!currentUser) return;
    if (activeTab === "friends") {
      sendToUser(currentUser, text);
    } else {
      sendChatRoom(currentUser, text);
    }
  };

  return (
    <div className="chat-layout">
      <Sidebar
        userList={userList}
        loading={loadingUsers}
        currentUser={currentUser}
        onSelectUser={handleSelect}
        checkUserExist={checkUserExist}
        searchUsers={searchUsers}
        searchLoading={searchLoading}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        refreshTrigger={friendsRefreshTrigger}
      />

      <main className="chat-main">
        {currentUser ? (
          <>
            <ChatHeader
              avatar="https://i.pravatar.cc/100"
              name={currentUser}
              activeTab={activeTab}
              loggedInUser={loggedInUser}
              onJoinRoomFromInvite={(roomId) => {
                // Khi bấm "Tham gia" từ chuông notifycation invite
                setActiveTab("groups");
                joinRoom(roomId);
                getRoomChatMessages(roomId);
              }}
            />

            {loadingMessages ? (
              <div style={{ padding: 16 }}>Đang tải tin nhắn...</div>
            ) : (
              <MessageList
                key={currentUser ?? "no-chat"}
                messages={messages}
                activeChatId={currentUser}
              />
            )}

            <ChatInput onSend={handleSend} />
          </>
        ) : (
          <div style={{ padding: 16 }}>Chọn một cuộc trò chuyện để bắt đầu</div>
        )}
      </main>
    </div>
  );
}
