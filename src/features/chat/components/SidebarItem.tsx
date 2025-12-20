import type { SidebarItemProps } from "../../../types/chat";

export default function SidebarItem({
  avatar,
  name,
  lastMessage,
  active,
  time,
  unread,
}: SidebarItemProps) {
  return (
    <div className={`chat-item ${active ? "active" : ""}`}>
      <img src={avatar} alt={name} />

      <div className="chat-item__body">
        <div className="chat-item__top">
          <strong>{name}</strong>
          {time && <span className="chat-item__time">{time}</span>}
        </div>

        <div className="chat-item__bottom">
          <p>{lastMessage}</p>
          {unread && <span className="chat-item__badge">{unread}</span>}
        </div>
      </div>
    </div>
  );
}
