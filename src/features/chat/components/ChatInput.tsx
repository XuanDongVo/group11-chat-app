import { Send, Smile, Image, Link } from "lucide-react";

export default function ChatInput() {
  return (
    <div className="chat-input">
      {/* emoji */}
      <button className="chat-input__icon">
        <Smile size={20} />
      </button>

      {/* input */}
      <input
        className="chat-input__field"
        placeholder="Message..."
      />

      {/* actions */}
      <button className="chat-input__icon">
        <Link size={20} />
      </button>

      <button className="chat-input__icon">
        <Image size={20} />
      </button>

      {/* send */}
      <button className="chat-input__send">
        <Send size={18} />
      </button>
    </div>
  );
}
