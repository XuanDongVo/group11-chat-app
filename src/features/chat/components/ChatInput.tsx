import { useState, useRef } from "react";
import { Send, Smile, Image, Link, Mic } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { EmojiUtils } from "../../../utils/EmojiUtils";
import AudioRecorder from "./AudioRecorder";
import "../../../styles/ChatInput.css";
import * as emoji from "emoji-dictionary";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string, isAudio?: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleSend = () => {
    const value = text.trim();
    if (!value) return;

    const encodedText = EmojiUtils.encode(value);
    onSend(encodedText, false);

    setText("");
    setShowEmoji(false);
  };

  const handleSendAudio = (audioBase64: string) => {
    onSend(audioBase64, true);
    setShowRecorder(false);
  };

  const handleEmojiClick = (emojiData: any) => {
    const name = emoji.getName(emojiData.emoji);
    console.log("Selected emoji:", name);
    setText((prev) => prev + " " + emojiData.emoji + " ");
    inputRef.current?.focus();
  };

  return (
    <div className="chat-input">
      {showRecorder ? (
        <AudioRecorder 
          onSendAudio={handleSendAudio}
          onCancel={() => setShowRecorder(false)}
        />
      ) : (
        <>
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

          {/* mic button */}
          <button
            type="button"
            className="chat-input-mic-btn"
            onClick={() => setShowRecorder(true)}
          >
            <Mic size={20} />
          </button>

          {/* send */}
          <button
            type="button"
            onClick={handleSend}
            className="chat-input-send-btn"
          >
            <Send size={18} />
          </button>
        </>
      )}
    </div>
  );
}
