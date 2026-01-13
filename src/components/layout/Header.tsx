import { LogOut, User, Moon, Sun, UserPlus } from "lucide-react";
import Offcanvas from "../ui/Offcanvas";
import FriendInvitesTab from "./FriendInvitesTab";
import type { FriendInvite } from "../../types/FriendInvites";
import type { HeaderProps } from "../../types/user";
import EffectPicker from "../effects/EffectPicker";
import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { getFriendRequests, cancelFriendRequest, acceptFriendRequest } from "../../services/friendService";
import RoomInvitesBell from "../../features/chat/components/RoomInvitesBell";

export default function Header({
  username,
  onLogout,
  onChangeEffect,
  onFriendsUpdate,
}: HeaderProps & { onFriendsUpdate?: () => void }) {
  const [open, setOpen] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  // Offcanvas for friend invites
  const [showInvites, setShowInvites] = useState(false);
  const [friendInvites, setFriendInvites] = useState<FriendInvite[]>([]);

  const fetchFriendInvites = async () => {
    const invitesRaw = await getFriendRequests(username);
    const invites: (FriendInvite & { _docId: string })[] = invitesRaw.map((invite: any) => ({
      _docId: invite.id || invite._docId || invite.docId || "",
      name: invite.from || invite.name || "Unknown",
      avatar: invite.avatar || "https://i.pravatar.cc/40",
    }));
    setFriendInvites(invites);
  };

  useEffect(() => {
    fetchFriendInvites();
  }, [showInvites]);

  const handleAcceptInvite = (inviteDocId: string) => {
    const invite = friendInvites.find((i) => i._docId === inviteDocId);
    if (!invite) return;
    acceptFriendRequest(inviteDocId, invite.name, username).then(() => {
      fetchFriendInvites();
      if (onFriendsUpdate) onFriendsUpdate();
    });
  };

  const handleRejectInvite = (inviteDocId: string) => {
    const invite = friendInvites.find((i) => i._docId === inviteDocId);
    if (!invite) return;
    cancelFriendRequest(inviteDocId).then(() => {
      fetchFriendInvites();
    });
  };

  return (
    <header className="app-header">
      <div className="app-header__left">
        <div className="header-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="app-title">Chat App</h2>
        </div>
        <div className="header-user-info">
          <div className="user-avatar-wrapper">
            <div className="user-avatar">
              <User size={16} />
            </div>
            <span className="online-indicator"></span>
          </div>
          <span className="username-text">{username}</span>
        </div>
      </div>

      <div className="app-header__right">
        <div className="effect-wrapper">
          <button
            className="header-icon-btn effect-trigger"
            onClick={() => setOpen((v) => !v)}
            title="Hiệu ứng nền"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path
                d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {open && (
            <EffectPicker
              activeEffect={currentEffect}
              onSelect={(effect) => {
                setCurrentEffect(effect);
                onChangeEffect(effect);
                setOpen(false);
              }}
            />
          )}
        </div>

        <button
          className="header-icon-btn theme-toggle"
          onClick={toggleTheme}
          title={theme === "light" ? "Chế độ tối" : "Chế độ sáng"}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* ✅ NEW: Lời mời vào nhóm (chuông) */}
        <RoomInvitesBell
          username={username}
          onJoinRoom={(roomId) => {
            window.dispatchEvent(new CustomEvent("room-invite:join", { detail: { roomId } }));
          }}
        />

        {/* Badge lời mời kết bạn */}
        <div className="invite-badge-wrapper">
          <button
            className="header-icon-btn invite-badge-btn"
            onClick={() => setShowInvites(true)}
            title="Lời mời kết bạn"
          >
            <UserPlus size={20} />
            {friendInvites.length > 0 && (
              <span className="notification-badge">{friendInvites.length}</span>
            )}
          </button>
        </div>

        <Offcanvas open={showInvites} onClose={() => setShowInvites(false)} title="Lời mời kết bạn">
          <FriendInvitesTab
            invites={friendInvites}
            onAccept={handleAcceptInvite}
            onReject={handleRejectInvite}
          />
        </Offcanvas>

        <button className="app-logout" onClick={onLogout}>
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}
