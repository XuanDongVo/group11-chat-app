import { useRef, useState } from "react";
import { MessageSquare, Menu, Search, Plus } from "lucide-react";
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
  const [openFriends, setOpenFriends] = useState(true);
  const [openChats, setOpenChats] = useState(true);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setKeyword(value);

    // clear debounce cũ
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) return;

    debounceRef.current = setTimeout(() => {
      checkUserExist(value.trim());
    }, 500);
  };

  const isSearching = keyword.trim().length > 0;

  const friends = userList.slice(0, Math.ceil(userList.length / 2));
  const chats = userList;

  return (
    <aside className="chat-sidebar">
      {/* ===== HEADER ===== */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <MessageSquare size={20} />
          <h3>ChatFlow</h3>
        </div>
        <Menu size={20} />
      </div>

      {/* ===== CREATE ROOM ===== */}
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

      {/* ===== SEARCH ===== */}
      <div className="sidebar-search">
        <Search size={16} />
        <input
          placeholder="Tìm kiếm người dùng..."
          value={keyword}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* ===== LOADING ===== */}
      {loading && <div style={{ padding: 12 }}>Đang tải...</div>}

      {/* ===== SEARCH MODE ===== */}
      {!loading && isSearching && (
        <div className="sidebar-group">
          <div className="sidebar-group__header">
            <span>Kết quả tìm kiếm</span>
          </div>
          <div className="sidebar-group__content open">
            {searchLoading ? (
              <div style={{ padding: 12 }}>Đang tìm...</div>
            ) : (
              <UserList
                users={searchUsers}
                activeUser={currentUser || ""}
                onSelectUser={onSelectUser}
              />
            )}
          </div>
        </div>
      )}

      {/* ===== NORMAL MODE ===== */}
      {!loading && !isSearching && (
        <>
          {/* ===== FRIENDS ===== */}
          <div className="sidebar-group">
            <div
              className="sidebar-group__header"
              onClick={() => setOpenFriends(!openFriends)}
            >
              <span>Bạn bè</span>
              <span>{openFriends ? "▲" : "▼"}</span>
            </div>

            <div
              className={`sidebar-group__content ${openFriends ? "open" : "closed"
                }`}
            >
              <UserList
                users={friends}
                activeUser={currentUser || ""}
                onSelectUser={onSelectUser}
              />
            </div>
          </div>

          <div className="sidebar-divider" />

          {/* ===== CHATS ===== */}
          <div className="sidebar-group">
            <div
              className="sidebar-group__header"
              onClick={() => setOpenChats(!openChats)}
            >
              <span>Chat</span>
              <span>{openChats ? "▲" : "▼"}</span>
            </div>

            <div
              className={`sidebar-group__content ${openChats ? "open" : "closed"
                }`}
            >
              {chats.map((user) => (
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
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
