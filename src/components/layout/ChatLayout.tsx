import Sidebar from "./Sidebar";
import ChatHeader from "../../features/chat/components/ChatHeader";
import MessageList from "../../features/chat/components/MessageList";
import ChatInput from "../../features/chat/components/ChatInput";

import type { ChatLayoutProps } from "../../types/chat";

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
}: ChatLayoutProps & {
  searchUsers: { name: string; avatar?: string }[];
  searchLoading: boolean;
}) {
  return (
    <div className="chat-layout">
      {/* SIDEBAR */}
      <Sidebar
        userList={userList}
        loading={loadingUsers}
        currentUser={currentUser}
        onSelectUser={selectUser}
        checkUserExist={checkUserExist}
        searchUsers={searchUsers}
        searchLoading={searchLoading}
      />

      {/* MAIN CHAT */}
      <main className="chat-main">
        {currentUser ? (
          <>
            <ChatHeader avatar="https://i.pravatar.cc/100" name={currentUser} />

            {loadingMessages ? (
              <div style={{ padding: 16 }}>Đang tải tin nhắn...</div>
            ) : (
              <MessageList messages={messages} />
            )}

            <ChatInput
              onSend={(text) => {
                if (!currentUser) return;
                sendToUser(currentUser, text);
              }}
            />
          </>
        ) : (
          <div style={{ padding: 16 }}>Chọn một cuộc trò chuyện để bắt đầu</div>
        )}
      </main>
    </div>
  );
}
