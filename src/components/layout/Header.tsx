import { LogOut, User, Moon, Sun, UserPlus } from "lucide-react";
import Offcanvas from "../ui/Offcanvas";
import FriendInvitesTab  from "./FriendInvitesTab";
import type { FriendInvite } from "../../types/FriendInvites";
import type { HeaderProps } from "../../types/user";
import EffectPicker from "../effects/EffectPicker";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";

export default function Header({
  username,
  onLogout,
  onChangeEffect,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  // Offcanvas for friend invites
  const [showInvites, setShowInvites] = useState(false);
  // Dummy data, replace with real data from props/context
  const [friendInvites, setFriendInvites] = useState<FriendInvite[]>([
    {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: "2",
      name: "Trần Thị B",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
  ]);
  const handleAcceptInvite = (id: string) => {
    setFriendInvites((prev) => prev.filter((invite) => invite.id !== id));
    // TODO: Gọi API accept ở đây
  };
  const handleRejectInvite = (id: string) => {
    setFriendInvites((prev) => prev.filter((invite) => invite.id !== id));
    // TODO: Gọi API reject ở đây
  };

  return (
    <header className="app-header">
      <div className="app-header__left">
        <h2 className="app-title">Messages</h2>
      </div>

      <div className="app-header__right">
        <div className="effect-wrapper">
          <button
            className="effect-trigger"
            onClick={() => setOpen(v => !v)}
            title="Hiệu ứng nền"
          >
            Hiệu ứng nền
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
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === "light" ? "Chế độ tối" : "Chế độ sáng"}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>


        {/* Badge lời mời kết bạn */}
        <div style={{ position: "relative", marginRight: 16 }}>
          <button
            className="invite-badge-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              padding: 0,
            }}
            onClick={() => setShowInvites(true)}
            title="Lời mời kết bạn"
          >
            <UserPlus size={22} />
            {friendInvites.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -8,
                  background:  "var(--bg-active)",
                  color: "var(--accent-primary)",
                  borderRadius: "50%",
                  fontSize: 12,
                  minWidth: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 5px",
                  fontWeight: 600,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}
              >
                {friendInvites.length}
              </span>
            )}
          </button>
        </div>

        <div className="app-user">
          <User size={18} />
          <span>{username}</span>
        </div>
      {/* Offcanvas lời mời kết bạn */}
      <Offcanvas 
        open={showInvites}
        onClose={() => setShowInvites(false)}
        title="Lời mời kết bạn"
      >
        <FriendInvitesTab
          invites={friendInvites}
          onAccept={handleAcceptInvite}
          onReject={handleRejectInvite}
        />
      </Offcanvas>

        <button className="app-logout" onClick={onLogout}>
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
