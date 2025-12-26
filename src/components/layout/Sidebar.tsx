import { useState } from "react";
import SidebarItem from "../../features/chat/components/SidebarItem";
import { MessageSquare, Menu, Search, Plus } from "lucide-react";
import CreateRoomModal from "../room/CreateRoomModal";
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
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <aside className="chat-sidebar">
      {/* Header – GIỮ NGUYÊN */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <MessageSquare size={20} />
          <h3>ChatFlow</h3>
        </div>
        <Menu size={20} />
      </div>

      {/* Button tạo phòng – GIỮ NGUYÊN */}
      <button
        className="sidebar-create-btn"
        title="Tạo phòng mới"
        onClick={() => setOpenCreate(true)}
      >
        <Plus size={18} />
      </button>

      <CreateRoomModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      {/* Search – GIỮ NGUYÊN */}
      <div className="sidebar-search">
        <Search size={16} />
        <input placeholder="Tìm kiếm tin nhắn..." />
      </div>

      {/* List – CHỈ THAY PHẦN NÀY */}
      {loading && <div style={{ padding: 12 }}>Đang tải...</div>}

      {!loading &&
        userList.map((user) => (
          <div
            key={user.name}
            onClick={() => onSelectUser(user.name)}
          >
            <SidebarItem
              avatar={user.avatar || "https://i.pravatar.cc/40"}
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
