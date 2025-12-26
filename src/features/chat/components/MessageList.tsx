import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "../../../types/chat";

export default function MessageList({
  messages,
}: {
  messages: ChatMessage[];
}) {
  return (
    <div className="chat-messages">
      {messages.map((msg, idx) => (
        <MessageBubble
          key={idx}
          text={msg.content}
          mine={msg.from === "me"} 
        />
      ))}
    </div>
  );
}
