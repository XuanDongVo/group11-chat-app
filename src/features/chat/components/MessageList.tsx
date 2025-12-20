import MessageBubble from "./MessageBubble";

export default function MessageList() {
  return (
    <div className="chat-messages">
      <MessageBubble text="Chào bạn nha !!" mine />
      <MessageBubble text="đẹp trai quá anh ơii" mine />
      <MessageBubble text="bạn nhắn gì tui zaa nhắn lại i chứ hong hiện tin nhắn thiệt =)))" />
    </div>
  );
}
