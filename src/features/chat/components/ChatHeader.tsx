import { Phone, Video, Info, UserPlus } from "lucide-react";
import { useState } from "react";
import type { ChatHeaderProps } from "../../../types/chat";

import InviteFriendsModal from "./InviteRoomModal";

export default function ChatHeader({
  avatar,
  name,
  status,
  activeTab = "friends",
  loggedInUser = "",
  userOnlineStatus,
}: ChatHeaderProps & {
  activeTab?: "friends" | "groups";
  loggedInUser?: string;
  onJoinRoomFromInvite?: (roomId: string) => void;
  userOnlineStatus?: { isOnline: boolean; lastSeen?: number } | null;
}) {
  const [showInvite, setShowInvite] = useState(false);


  // Tính toán status text dựa trên userOnlineStatus
  let statusText = "Đang kiểm tra..."; // Default khi chưa có data
  let statusClass = "chat-header__status chat-header__status--offline";

  // Chỉ hiển thị status cho tab friends
  if (activeTab === "friends") {
    if (userOnlineStatus === null || userOnlineStatus === undefined) {
      // Đang loading hoặc chưa có data
      statusText = "Đang kiểm tra...";
      statusClass = "chat-header__status chat-header__status--offline"; 
    } else if (userOnlineStatus.isOnline) {
      statusText = "Hoạt động";
      statusClass = "chat-header__status chat-header__status--online";
    } else {
      // Offline - không hiển thị thời gian
      statusText = "Không hoạt động";
      statusClass = "chat-header__status chat-header__status--offline";
    }
  } else {
    // Tab groups - dùng status mặc định
    statusText = status || "ACTIVE NOW";
    statusClass = "chat-header__status";
  }

  return (
    <header className="chat-header">
      <div className="chat-header__left">
        <div className="chat-header__avatar-wrapper">
          <img className="chat-header__avatar" src={avatar} alt={name} />
        </div>
        <div className="chat-header__info">
          <h4 className="chat-header__name">{name}</h4>
          <span className={statusClass}>{statusText}</span>
        </div>
      </div>

      <div className="chat-header__actions">
        {/*  chỉ hiện khi đang ở tab NHÓM */}
        {activeTab === "groups" && (
          <button
            className="chat-header__action-btn"
            title="Mời bạn vào nhóm"
            onClick={() => setShowInvite(true)}
          >
            <UserPlus size={18} />
          </button>
        )}

        <button className="chat-header__action-btn" title="Call">
          <Phone size={18} />
        </button>
        <button className="chat-header__action-btn" title="Video call">
          <Video size={18} />
        </button>
        <button className="chat-header__action-btn" title="Info">
          <Info size={18} />
        </button>
      </div>

      {/* Modal mời bạn */}
      <InviteFriendsModal
        open={showInvite}
        onClose={() => setShowInvite(false)}
        roomId={name}                // room hiện tại (VD: NLU_FE_GROUP11)
        currentUser={loggedInUser}   //  user đang login (VD: duc)
      />
    </header>
  );
}
