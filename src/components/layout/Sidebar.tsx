import { useEffect, useRef, useState } from "react";
import { MessageSquare, Search, User, Users, UserPlus } from "lucide-react";
import CreateRoomModal from "../room/CreateRoomModal";
import SidebarItem from "../../features/chat/components/SidebarItem";
import UserList from "../../features/chat/components/UserList";
import type { SidebarProps } from "../../types/chat";
import "../../styles/Sidebar.css";
import { getFriends, sendFriendRequest } from "../../services/friendService";

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
  const [friends, setFriends] = useState<{ name: string; avatar?: string; lastMessage?: string; time?: string; unread?: number }[]>([]);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
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

  const handleAddFriend = async (username: string) => {
    if (username === currentUserName) {
      alert("Bạn không thể kết bạn với chính mình");
      return;
    }

    setSendingRequest(username);
    try {
      await sendFriendRequest(currentUserName, username);
      alert("Đã gửi lời mời kết bạn thành công!");
      setKeyword(""); // Clear search after sending request
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSendingRequest(null);
    }
  };

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
      </div>

      {/*  CREATE GROUP BUTTON  */}
      <div className="sidebar-create-section">
        <button
          className="create-group-btn"
          onClick={() => setOpenCreate(true)}
        >
          <MessageSquare size={16} />
          <span>TẠO NHÓM</span>
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
          ) : activeTab === "friends" ? (
            // Khi đang ở tab bạn bè và tìm kiếm, hiển thị kết quả với nút kết bạn
            searchUsers.length > 0 ? (
              <div className="user-list">
                {searchUsers.map((user) => {
                  const isFriend = friends.some(f => f.name === user.name);
                  const isCurrentUser = user.name === currentUserName;
                  
                  return (
                    <div
                      key={user.name}
                      className="user-list__item"
                    >
                      <img
                        src={user.avatar || "https://i.pravatar.cc/36"}
                        alt={user.name}
                      />
                      <span className="user-list__name">{user.name}</span>
                      {!isFriend && !isCurrentUser && (
                        <button
                          className="add-friend-btn"
                          onClick={() => handleAddFriend(user.name)}
                          disabled={sendingRequest === user.name}
                        >
                          {sendingRequest === user.name ? (
                            "Đang gửi..."
                          ) : (
                            <>
                              <UserPlus size={14} />
                              Kết bạn
                            </>
                          )}
                        </button>
                      )}
                      {isFriend && <span className="friend-badge">Đã là bạn bè</span>}
                      {isCurrentUser && <span className="friend-badge">Bạn</span>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="sidebar-loading" style={{ color: '#ff6b6b' }}>
                Không tìm thấy người dùng "{keyword}"
              </div>
            )
          ) : (
            searchUsers.length > 0 ? (
              <UserList
                users={searchUsers}
                activeUser={currentUser || ""}
                onSelectUser={onSelectUser}
              />
            ) : (
              <div className="sidebar-loading" style={{ color: '#ff6b6b' }}>
                Không tìm thấy nhóm "{keyword}"
              </div>
            )
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
