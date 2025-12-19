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
        <img className="chat-header__avatar" src={avatar} />
        <div className="chat-header__info">
          <h4>{name}</h4>
          {status && <span>{status}</span>}
        </div>
      </div>

      <div className="chat-header__actions">
        <button><Phone size={18} /></button>
        <button><Video size={18} /></button>
        <button><Info size={18} /></button>
      </div>
    </header>
  );
}
