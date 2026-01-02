import { Phone, Video, Info } from "lucide-react";
import type { ChatHeaderProps } from "../../../types/chat";

export default function ChatHeader({
  avatar,
  name,
  status,
}: ChatHeaderProps) {
  return (
    <header className="chat-header">
      <div className="chat-header__left">
        <div className="chat-header__avatar-wrapper">
          <img className="chat-header__avatar" src={avatar} alt={name} />
        </div>
        <div className="chat-header__info">
          <h4 className="chat-header__name">{name}</h4>
          <span className="chat-header__status">{status || "ACTIVE NOW"}</span>
        </div>
      </div>

      <div className="chat-header__actions">
        <button className="chat-header__action-btn" title="Call">
          <Phone size={18} />
        </button>
        <button className="chat-header__action-btn" title="Video call">
          <Video size={18} />
        </button>
        <button className="chat-header__action-btn" title="Info">
          <Info size={18} />
        </button>
      </div>
    </header>
  );
}
