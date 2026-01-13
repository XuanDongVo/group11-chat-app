import { useEffect, useRef, useState } from "react";
import { MessageSquare, Search, User, Users, UserPlus } from "lucide-react";
import CreateRoomModal from "../room/CreateRoomModal";
import SidebarItem from "../../features/chat/components/SidebarItem";
// import UserList from "../../features/chat/components/UserList";
import type { SidebarProps } from "../../types/chat";
import "../../styles/UserList.css";
import "../../styles/Sidebar.css";
import { getFriends, sendFriendRequest } from "../../services/friendService";
import { listenRoomsOfUser } from "../../services/roomInviteService";
import Swal from "sweetalert2";

export default function Sidebar({
  // userList,
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
  const [friends, setFriends] = useState<
    {
      name: string;
      avatar?: string;
      lastMessage?: string;
      time?: string;
      unread?: number;
    }[]
  >([]);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const currentUserName = localStorage.getItem("username") || "";
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [groupRooms, setGroupRooms] = useState<
    {
      name: string;
      avatar?: string;
      lastMessage?: string;
      time?: string;
      unread?: number;
    }[]
  >([]);

  useEffect(() => {
    if (!currentUserName) return;

    const unsub = listenRoomsOfUser(currentUserName, (rooms) => {
      setGroupRooms(
        rooms.map((r) => ({
          name: r.roomId,
          avatar:
            "https://api.dicebear.com/7.x/identicon/svg?seed=" +
            encodeURIComponent(r.roomId),
          lastMessage: "",
          time: "",
          unread: 0,
        }))
      );
    });

    return () => unsub?.();
  }, [currentUserName, refreshTrigger]);

  const handleSearchChange = (value: string) => {
    setKeyword(value);

    // clear debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) return;

    // Tab BẠN BÈ: mới gọi checkUserExist
    if (activeTab === "friends") {
      debounceRef.current = setTimeout(() => {
        checkUserExist(value.trim());
      }, 500);
    }
  };

  // Polling để tự động refresh danh sách bạn bè mỗi 3 giây
  const displayList = activeTab === "friends" ? friends : groupRooms;
  useEffect(() => {
    const fetchFriends = async () => {
      const data = await getFriends(currentUserName);
      setFriends(data);
    };

    fetchFriends();


    const intervalId = setInterval(() => {
      if (displayList) {
        fetchFriends();
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentUser, refreshTrigger, activeTab]);

  const isSearching = keyword.trim().length > 0;

  // Danh sách group
  // const friendNames = friends.map((f) => f.name);
  // const groups = userList.filter(
  //   (user) => user.name !== currentUserName && !friendNames.includes(user.name)
  // );

  const handleAddFriend = async (username: string) => {
    if (username === currentUserName) {
      alert("Bạn không thể kết bạn với chính mình");
      return;
    }

    setSendingRequest(username);
    try {
      await sendFriendRequest(currentUserName, username);
      Swal.fire({
        title: "Thành công!",
        text: "Đã gửi lời mời kết bạn thành công!",
        icon: "success",
        confirmButtonText: "Đóng",
      });
      setKeyword("");
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setSendingRequest(null);
    }
  };

  return (
    <aside className="chat-sidebar">
      <CreateRoomModal open={openCreate} onClose={() => setOpenCreate(false)} />

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
          placeholder={`Tìm kiếm ${activeTab === "groups" ? "nhóm" : "bạn bè"
            }...`}
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
                  const isFriend = friends.some((f) => f.name === user.name);
                  const isCurrentUser = user.name === currentUserName;

                  return (
                    <div key={user.name} className="user-list__item" onClick={() => {
                      if (isFriend) {
                        onSelectUser(user.name);
                      }
                    }}>
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
                      {isFriend && (
                        <span className="friend-badge">Đã là bạn bè</span>
                      )}
                      {isCurrentUser && (
                        <span className="friend-badge">Bạn</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="sidebar-loading" style={{ color: "#ff6b6b" }}>
                Không tìm thấy người dùng "{keyword}"
              </div>
            )
          ) : (
            <>
              {(() => {
                const k = keyword.trim().toLowerCase();
                const filteredGroups = groupRooms.filter((r) =>
                  r.name.toLowerCase().includes(k)
                );

                return filteredGroups.length > 0 ? (
                  filteredGroups.map((room) => (
                    <div
                      key={room.name}
                      onClick={() => onSelectUser(room.name)}
                    >
                      <SidebarItem
                        avatar={room.avatar || "https://i.pravatar.cc/40"}
                        name={room.name}
                        lastMessage={room.lastMessage || ""}
                        time={room.time}
                        unread={room.unread}
                        active={currentUser === room.name}
                      />
                    </div>
                  ))
                ) : (
                  <div className="sidebar-loading" style={{ color: "#ff6b6b" }}>
                    Không tìm thấy nhóm "{keyword}"
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}

      {/* ===== NORMAL MODE ===== */}
      {!loading && !isSearching && (
        <div className="sidebar-chat-list">
          {displayList.length > 0 ? (
            displayList.map((user) => (
              <div key={user.name} onClick={() => onSelectUser(user.name)}>
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
