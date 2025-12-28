import { useState } from "react";
import { Send, Smile, Image, Link } from "lucide-react";

export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  };

  return (
    <div className="chat-input">
      {/* emoji */}
      <button className="chat-input__icon" type="button">
        <Smile size={20} />
      </button>

      {/* input */}
      <input
        className="chat-input__field"
        placeholder="Gửi tin nhắn đến ..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      {/* actions */}
      <button className="chat-input__icon" type="button">
        <Link size={20} />
      </button>

      <button className="chat-input__icon" type="button">
        <Image size={20} />
      </button>

      {/* send */}
      <button className="chat-input__send" type="button" onClick={handleSend}>
        <Send size={18} />
      </button>
    </div>
  );
}
