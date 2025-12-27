import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "../../../types/chat";

export default function MessageList({
  messages,
}: {
  messages: ChatMessage[];
}) {
  const currentUser = localStorage.getItem("username"); 
//  const myUsername = localStorage.getItem("username"); 
  return (
    <div className="chat-messages">
      {messages.map((msg, idx) => (
        <MessageBubble
          key={idx}
          text={msg.content}
          mine={msg.from !== currentUser}
          // mine={msg.from === myUsername}
        />
      ))}
    </div>
  );
}
