import clsx from "clsx";
import { Volume2 } from "lucide-react";
import type { MessageBubblePropsExtended } from "../../../types/chat";

function formatTime(time?: string): string {
  if (!time) return "";
  try {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "";
  }
}

function getStatusText(mine: boolean): string {
  return mine ? "SENT" : "";
}

export default function MessageBubble({ message, mine = false, onImageClick, avatar }: MessageBubblePropsExtended) {
  const timeStr = formatTime(message.time);
  const statusText = getStatusText(mine);

  const handleImageClick = (imageUrl?: string) => {
    if (imageUrl && onImageClick) {
      onImageClick(imageUrl);
    }
  };

  if (message.type === "audio" && message.audio) {
    return (
      <div className={clsx("message", "message--audio", mine && "mine")}>
        {/* Hiển thị tên người gửi phía trên bubble, chỉ cho tin nhắn người khác */}
        {!mine && (
          <img src={avatar} alt={message.from} className="message__avatar" />
        )}
        <div className="message__content">
          {!mine && (
            <div className="message__from" style={{ fontWeight: 500, fontSize: 13, marginBottom: 2, marginLeft: 20, marginTop: 2, color: "#333333",  opacity: 0.8 }}>
              {message.from}
            </div>
          )}
          <div className="message__audio">
            <Volume2 size={16} className="audio-icon" />
            <audio src={message.audio} controls className="audio-player" />
          </div>
          <div className="message__meta">
            <span className="message__time">{timeStr}</span>
            {mine && statusText && (
              <span className="message__status">{statusText}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("message", mine && "mine")}>
      {/* Hiển thị tên người gửi phía trên bubble, chỉ cho tin nhắn người khác */}
      {!mine && (
        <img src={avatar} alt={message.from} className="message__avatar" />
      )}
      <div className="message__content">
        {!mine && (
          <div className="message__from" style={{ fontWeight: 500, fontSize: 13, marginBottom: 2, marginLeft: 20, marginTop: 2, color: "#333333", opacity: 0.8 }}>
            {message.from}
          </div>
        )}
        {/* TEXT */}
        {message.type === "text" && (
          <div className="message__bubble">
            <p className="message__description">{message.text}</p>
          </div>
        )}

        {/* IMAGE */}
        {message.type === "image" && (
          <div className="message__bubble">
            <img
              src={message.image}
              alt="chat-img"
              className="message__image message__image--clickable"
              onClick={() => handleImageClick(message.image)}
            />
          </div>
        )}

        {/* TEXT + IMAGE */}
        {message.type === "text_image" && (
          <div className="message__bubble message__text_image">
            {message.image && (
              <img
                src={message.image}
                alt="chat-img"
                className="message__image message__image--mb message__image--clickable"
                onClick={() => handleImageClick(message.image)}
              />
            )}

            {message.text && (
              <span className="message__text_image-text">
                <p className="message__description message__description--text_image">
                  {message.text}
                </p>
              </span>
            )}
          </div>
        )}

        <div className="message__meta">
          <span className="message__time">{timeStr}</span>
          {mine && statusText && (
            <span className="message__status">• {statusText}</span>
          )}
        </div>
      </div>
    </div>
  );
}
