import { useEffect, useRef, useState } from "react";
import { MessageSquare, Search, User, Users, UserPlus } from "lucide-react";
import CreateRoomModal from "../room/CreateRoomModal";
import SidebarItem from "../../features/chat/components/SidebarItem";
import UserList from "../../features/chat/components/UserList";
import AddFriendModal from "../user/AddFriendModal";
import type { SidebarProps } from "../../types/chat";
import "../../styles/Sidebar.css";
import { getFriends } from "../../services/friendService";

export default function Sidebar({
  userList,
  loading,
  currentUser,
  onSelectUser,
  checkUserExist,
  searchUsers,
  searchLoading,
  activeTab,
  onTabChange,
  refreshTrigger,
}: SidebarProps & {
  checkUserExist: (username: string) => void;
  searchUsers: { name: string; avatar?: string }[];
  searchLoading: boolean;
  activeTab: "friends" | "groups";
  onTabChange: (tab: "friends" | "groups") => void;
  refreshTrigger?: number;
}) {
  const [keyword, setKeyword] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openAddFriend, setOpenAddFriend] = useState(false);
  const [friends, setFriends] = useState<{ name: string; avatar?: string; lastMessage?: string; time?: string; unread?: number }[]>([]);
  const currentUserName = localStorage.getItem("username") || "";
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

  useEffect(() => {
    const fetchFriends = async () => {
      const data = await getFriends(currentUserName);
      setFriends(data);
    };

    fetchFriends();

    // Polling để tự động refresh danh sách bạn bè mỗi 3 giây
    const intervalId = setInterval(() => {
      if (activeTab === "friends") {
        fetchFriends();
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentUser, refreshTrigger, activeTab]);

  const isSearching = keyword.trim().length > 0;

  // Danh sách group
  const friendNames = friends.map(f => f.name);
  const groups = userList.filter(
    user =>
      user.name !== currentUserName &&
      !friendNames.includes(user.name)
  );


  // Chọn danh sách hiển thị dựa trên tab đang active
  const displayList = activeTab === "friends" ? friends : groups;

  return (
    <aside className="chat-sidebar">
      <CreateRoomModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      <AddFriendModal
        open={openAddFriend}
        onClose={() => setOpenAddFriend(false)}
        currentUser={currentUserName}
      />

      {/* ===== TABS ===== */}
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === "friends" ? "active" : ""}`}
          onClick={() => onTabChange("friends")}
        >
          <User size={16} />
          <span>BẠN BÈ</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === "groups" ? "active" : ""}`}
          onClick={() => onTabChange("groups")}
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
        <button
          className="sidebar-tab sidebar-tab-add-friend"
          onClick={() => setOpenAddFriend(true)}
          title="Thêm bạn mới"
        >
          <UserPlus size={16} />
          <span>THÊM BẠN</span>
        </button>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="sidebar-search">
        <Search size={16} />
        <input
          placeholder={`Tìm kiếm ${activeTab === "groups" ? "nhóm" : "bạn bè"}...`}
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
                  lastMessage={user.lastMessage || ""}
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
