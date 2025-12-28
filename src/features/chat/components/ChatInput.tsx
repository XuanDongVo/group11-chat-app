import { useState, useRef } from "react";
import { Send, Smile, Image, Link } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import * as emoji from "emoji-dictionary";
import "../../../styles/ChatInput.css";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  };

  const handleEmojiClick = (emojiData: any) => {
   
  };

  return (
    <div className="chat-input">
      {/* emoji button */}
      <button
        type="button"
        className="chat-input-emoji-btn"
        onClick={() => setShowEmoji((v) => !v)}
      >
        <Smile size={20} />
      </button>

      {/* emoji picker */}
      {showEmoji && (
        <div className="chat-input-emoji-picker">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            height={360}
            width={320}
          />
        </div>
      )}

      {/* input */}
      <input
        ref={inputRef}
        placeholder="Gửi tin nhắn..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="chat-input-field"
      />

      {/* link */}
      <button
        type="button"
        className="chat-input-link-btn"
      >
        <Link size={20} />
      </button>

      {/* image */}
      <button
        type="button"
        className="chat-input-link-btn"
      >
        <Image size={20} />
      </button>

      {/* send */}
      <button
        type="button"
        onClick={handleSend}
        className="chat-input-send-btn"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
