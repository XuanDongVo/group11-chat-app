import { useState, useRef } from "react";
import { Send, Smile, Image, Link, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { EmojiUtils } from "../../../utils/EmojiUtils";
import "../../../styles/ChatInput.css";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SEND TEXT 
  const handleSend = async () => {
    if (!text.trim() && !imageFile) return;

    let message = "";

    const encodedText = text.trim()
      ? EmojiUtils.encode(text.trim())
      : "";

    let imageUrl: string | null = null;

    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile);
    }

    if (encodedText && imageUrl) {
      message = `TEXT_IMAGE::${encodedText}|${imageUrl}`;
    } else if (imageUrl) {
      message = `IMAGE::${imageUrl}`;
    } else if (encodedText) {
      message = `TEXT::${encodedText}`;
    }

    if (message) {
      onSend(message);
    }

    setText("");
    removeImage();
    setShowEmoji(false);
  };



  // EMOJI
  const handleEmojiClick = (emojiData: any) => {
    setText((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  // IMAGE PICK
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    e.target.value = "";
  };

  // REMOVE IMAGE
  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  async function uploadToCloudinary(file: File): Promise<string | null> {
    const url = "https://api.cloudinary.com/v1_1/ddqre1ndq/image/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat_app_frontend");

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url || null;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* image preview */}
      {imagePreview && (
        <div className="chat-input-image-preview">
          <img src={imagePreview} alt="preview" />
          <button
            type="button"
            className="chat-input-remove-image"
            onClick={removeImage}
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div className="chat-input">


        {/* emoji */}
        <button
          type="button"
          className="chat-input-emoji-btn"
          onClick={() => setShowEmoji((v) => !v)}
        >
          <Smile size={20} />
        </button>

        {showEmoji && (
          <div className="chat-input-emoji-picker">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* input */}
        <div className="chat-input">
          <input
            ref={inputRef}
            className="chat-input-field"
            placeholder="Gửi tin nhắn..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>

        {/* link (future) */}
        <button type="button" className="chat-input-link-btn">
          <Link size={20} />
        </button>

        {/* image */}
        <button
          type="button"
          className="chat-input-link-btn"
          onClick={handleImageClick}
        >
          <Image size={20} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageSelect}
        />

        {/* send */}
        <button
          type="button"
          className="chat-input-send-btn"
          onClick={handleSend}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );

}
