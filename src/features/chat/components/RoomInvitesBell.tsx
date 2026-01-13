import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import {
  acceptRoomInvite,
  rejectRoomInvite,
  listenPendingRoomInvites,
  type RoomInvite,
} from "../../../services/roomInviteService";
import type { RoomProps } from "../../../types/RoomInvites";
import "../../../styles/RoomInvitesBell.css";

function initials(name: string) {
  const s = (name || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function RoomInvitesBell({ username, onJoinRoom }: RoomProps) {
  const [open, setOpen] = useState(false);
  const [invites, setInvites] = useState<RoomInvite[]>([]);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!username) return;
    const unsub = listenPendingRoomInvites(username, setInvites);
    return () => unsub?.();
  }, [username]);

  const count = invites.length;

  const sortedInvites = useMemo(() => {
    // nếu có createdAt thì sort được, còn không thì giữ nguyên
    return invites;
  }, [invites]);

  // click outside để đóng
  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const handleAccept = async (invite: RoomInvite) => {
    await acceptRoomInvite({
      inviteId: invite.id,
      roomId: invite.roomId,
      username,
    });
    onJoinRoom(invite.roomId);
    setOpen(false);
  };

  const handleReject = async (invite: RoomInvite) => {
    await rejectRoomInvite(invite.id);
  };

  return (
    <div className="roomBell" ref={wrapRef}>
      <button
        className="header-icon-btn roomBell__btn"
        onClick={() => setOpen((p) => !p)}
        title="Lời mời vào nhóm"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Bell size={20} />
        {count > 0 && <span className="roomBell__badge">{count}</span>}
      </button>

      {open && (
        <div className="roomBell__panel" role="menu">
          <div className="roomBell__panelHeader">
            <div className="roomBell__title">Lời mời vào nhóm</div>
            {count > 0 && <div className="roomBell__count">{count}</div>}
          </div>

          {sortedInvites.length === 0 ? (
            <div className="roomBell__empty">Không có lời mời.</div>
          ) : (
            <div className="roomBell__list">
              {sortedInvites.map((inv) => (
                <div key={inv.id} className="roomBell__item">
                  <div className="roomBell__avatar" aria-hidden>
                    {initials(inv.from)}
                  </div>

                  <div className="roomBell__content">
                    <div className="roomBell__line1" title={inv.from}>
                      <span className="roomBell__from">{inv.from}</span>
                      <span className="roomBell__text"> mời bạn vào nhóm</span>
                    </div>

                    <div className="roomBell__room" title={inv.roomId}>
                      {inv.roomId}
                    </div>
                  </div>

                  <div className="roomBell__actions">
                    <button
                      className="roomBell__btnAction roomBell__btnAction--accept"
                      onClick={() => handleAccept(inv)}
                      title="Tham gia"
                    >
                      <Check size={16} />
                      <span>Tham gia</span>
                    </button>

                    <button
                      className="roomBell__btnAction roomBell__btnAction--reject"
                      onClick={() => handleReject(inv)}
                      title="Từ chối"
                    >
                      <X size={16} />
                      <span>Từ chối</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="roomBell__footer">
            <button className="roomBell__close" onClick={() => setOpen(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
