import SidebarItem from "../../features/chat/components/SidebarItem";
import type { SidebarItemProps } from "../../types/chat";

interface SidebarProps {
  userList: SidebarItemProps[];
  loading: boolean;
  currentUser: string | null;
  onSelectUser: (username: string) => void;
}

export default function Sidebar({
  userList,
  loading,
  currentUser,
  onSelectUser,
}: SidebarProps) {
  if (loading) {
    return <aside className="chat-sidebar">Đang tải...</aside>;
  }

  return (
    <aside className="chat-sidebar">
      {userList.map((user) => (
        <div
          key={user.name}
          onClick={() => onSelectUser(user.name)}
        >
          <SidebarItem
            avatar={user.avatar}
            name={user.name}
            lastMessage={user.lastMessage}
            time={user.time}
            unread={user.unread}
            active={currentUser === user.name}
          />
        </div>
      ))}
    </aside>
  );
}
