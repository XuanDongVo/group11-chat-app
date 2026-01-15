import type { SidebarItemProps } from "../../../types/chat";

function formatLastSeenTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

export default function SidebarItem({
  avatar,
  name,
  lastMessage,
  active,
  time,
  unread,
  isOnline,
  lastSeen,
}: SidebarItemProps) {
  // Chỉ hiển thị thời gian khi user online
  const displayTime = (isOnline && lastSeen) ? formatLastSeenTime(lastSeen) : (isOnline ? time : undefined);
  
  return (
    <div className={`chat-item ${active ? "active" : ""}`}>
      <div className="chat-item__avatar-wrapper">
        <img src={avatar} alt={name} />
        {isOnline !== undefined && (
          <span className={`chat-item__online-dot ${isOnline ? 'online' : 'offline'}`}></span>
        )}
      </div>

      <div className="chat-item__body">
        <div className="chat-item__top">
          <strong>{name}</strong>
          {displayTime && <span className="chat-item__time">{displayTime}</span>}
        </div>

        <div className="chat-item__bottom">
          <p>{lastMessage}</p>
          {unread && <span className="chat-item__badge">{unread}</span>}
        </div>
      </div>
    </div>
  );
}
