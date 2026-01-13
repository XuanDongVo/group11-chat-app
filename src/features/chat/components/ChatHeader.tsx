import { Phone, Video, Info, UserPlus } from "lucide-react";
import { useState } from "react";
import type { ChatHeaderProps } from "../../../types/chat";

import InviteFriendsModal from "./InviteRoomModal";
import RoomInvitesBell from "./RoomInvitesBell";

export default function ChatHeader({
  avatar,
  name,
  status,
  activeTab = "friends",
  loggedInUser = "",
  onJoinRoomFromInvite,
}: ChatHeaderProps & {
  activeTab?: "friends" | "groups";
  loggedInUser?: string;
  onJoinRoomFromInvite?: (roomId: string) => void;
}) {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <header className="chat-header">
      <div className="chat-header__left">
        <div className="chat-header__avatar-wrapper">
          <img className="chat-header__avatar" src={avatar} alt={name} />
        </div>
        <div className="chat-header__info">
          <h4 className="chat-header__name">{name}</h4>
          <span className="chat-header__status">{status || "ACTIVE NOW"}</span>
        </div>
      </div>

      <div className="chat-header__actions">
        {/* Lời mời vào nhóm */}
        <RoomInvitesBell
          username={loggedInUser}
          onJoinRoom={(roomId) => onJoinRoomFromInvite?.(roomId)}
        />

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
