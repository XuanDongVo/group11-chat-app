import type { SidebarItemProps } from "../../../types/chat";

export default function SidebarItem({
  avatar,
  name,
  lastMessage,
  active,
}: SidebarItemProps) {
  return (
    <div className={`chat-item ${active ? "active" : ""}`}>
      <img src={avatar} alt={name} />
      <div className="chat-item__content">
        <strong>{name}</strong>
        <p>{lastMessage}</p>
      </div>
    </div>
  );
}
