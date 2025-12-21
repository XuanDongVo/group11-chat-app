import { useState } from "react";
import SidebarItem from "../../features/chat/components/SidebarItem";
import { MessageSquare, Menu, Search, Plus } from "lucide-react";
import CreateRoomModal from "../room/CreateRoomModal";

export default function Sidebar() {
  const [openCreate, setOpenCreate] = useState(false);
  return (
    <aside className="chat-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <MessageSquare size={20} />
          <h3>ChatFlow</h3>
        </div>
        <Menu size={20} />
      </div>

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

      {/* Search */}
      <div className="sidebar-search">
        <Search size={16} />
        <input placeholder="Tìm kiếm tin nhắn..." />
      </div>

      {/* List */}
      <SidebarItem
        avatar="https://i.pravatar.cc/40?img=5"
        name="Trí Đức"
        lastMessage="Hẹn gặp lại bạn nhé!"
        time="2 phút"
        unread={3}
        active
      />

      <SidebarItem
        avatar="https://i.pravatar.cc/40?img=8"
        name="Công Vinh"
        lastMessage="Cảm ơn bạn nhiều"
        time="15 phút"
      />

      <SidebarItem
        avatar="https://i.pravatar.cc/40?img=11"
        name="Xuân Đông"
        lastMessage="Đã gửi file báo cáo"
        time="1 giờ"
      />

      <SidebarItem
        avatar="https://i.pravatar.cc/40?img=13"
        name="Minh Thư"
        lastMessage="Ok bạn ơi"
        time="3 giờ"
      />
    </aside>
  );
}
