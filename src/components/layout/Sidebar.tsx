import { useRef, useState } from "react";
import { MessageSquare, Search, User, Users } from "lucide-react";
import CreateRoomModal from "../room/CreateRoomModal";
import SidebarItem from "../../features/chat/components/SidebarItem";
import UserList from "../../features/chat/components/UserList";
import type { SidebarProps } from "../../types/chat";
import "../../styles/Sidebar.css";

export default function Sidebar({
  userList,
  loading,
  currentUser,
  onSelectUser,
  checkUserExist,
  searchUsers,
  searchLoading,
}: SidebarProps & {
  checkUserExist: (username: string) => void;
  searchUsers: { name: string; avatar?: string }[];
  searchLoading: boolean;
}) {
  const [keyword, setKeyword] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setKeyword(value);

    // clear debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) return;

    debounceRef.current = setTimeout(() => {
      checkUserExist(value.trim());
    }, 500);
  };

  const isSearching = keyword.trim().length > 0;

  // Phân chia friends và groups 
  const friends = userList.slice(0, Math.ceil(userList.length / 2));
  const groups = userList.slice(Math.ceil(userList.length / 2));

  // Chọn danh sách hiển thị dựa trên tab đang active
  const displayList = activeTab === "friends" ? friends : groups;

  return (
    <aside className="chat-sidebar">
      <CreateRoomModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      {/* ===== TABS ===== */}
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === "friends" ? "active" : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          <User size={16} />
          <span>BẠN BÈ</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === "groups" ? "active" : ""}`}
          onClick={() => setActiveTab("groups")}
        >
          <Users size={16} />
          <span>NHÓM</span>
        </button>
        <button
          className="sidebar-tab sidebar-tab-create"
          onClick={() => setOpenCreate(true)}
          title="Tạo nhóm chat"
        >
          <MessageSquare size={16} />
          <span>TẠO NHÓM</span>
        </button>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="sidebar-search">
        <Search size={16} />
        <input
          placeholder={`Tìm kiếm cuộc ${activeTab === "groups" ? "nhóm" : "bạn bè"}...`}
          value={keyword}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* ===== LOADING ===== */}
      {loading && <div className="sidebar-loading">Đang tải...</div>}

      {/* ===== SEARCH MODE ===== */}
      {!loading && isSearching && (
        <div className="sidebar-chat-list">
          {searchLoading ? (
            <div className="sidebar-loading">Đang tìm...</div>
          ) : (
            <UserList
              users={searchUsers}
              activeUser={currentUser || ""}
              onSelectUser={onSelectUser}
            />
          )}
        </div>
      )}

      {/* ===== NORMAL MODE ===== */}
      {!loading && !isSearching && (
        <div className="sidebar-chat-list">
          {displayList.length > 0 ? (
            displayList.map((user) => (
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
            ))
          ) : (
            <div className="sidebar-loading">
              {activeTab === "friends" ? "Chưa có bạn bè" : "Chưa có nhóm"}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
