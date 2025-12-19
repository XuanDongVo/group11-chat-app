import Sidebar from "./Sidebar";
import MessageList from "../../features/chat/components/MessageList";
import ChatInput from "../../features/chat/components/ChatInput";
import ChatHeader from "../../features/chat/components/ChatHeader";

export default function ChatLayout() {
  return (
    <div className="chat-app">
      <Sidebar />

      <div className="chat-main">
        <ChatHeader
          avatar="https://i.pravatar.cc/40"
          name="Trí Đức"
          status="online"
        />
        <MessageList />
        <ChatInput />
      </div>
    </div>
  );
}
