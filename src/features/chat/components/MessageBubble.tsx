import clsx from "clsx";
import type { MessageBubbleProps } from "../../../types/chat";

export default function MessageBubble({ message, mine }: MessageBubbleProps) {
  return (
    <div className={clsx("message", mine && "mine")}>
      {/* TEXT */}
      {message.type === "text" && (
        <p className="message__description">{message.text}</p>
      )}

      {/* IMAGE */}
      {message.type === "image" && (
        <img
          src={message.image}
          alt="chat-img"
          className="message__image"
        />
      )}

      {/* TEXT + IMAGE */}
      {message.type === "text_image" && (
        <div className="message__text_image">
          {message.image && (
            <img
              src={message.image}
              alt="chat-img"
              className="message__image message__image--mb"
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
    </div>
  );
}
