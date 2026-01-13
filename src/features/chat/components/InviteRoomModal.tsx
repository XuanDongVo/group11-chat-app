import React, { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { listInvitableFriends, sendRoomInvite } from "../../../services/roomInviteService";
import type { InviteFriendsModalProps as Props } from "../../../types/RoomInvites";
import '../../../styles/InvitesRoomModal.css'

function getInitials(name: string) {
  const s = (name || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function InviteFriendsModal({ open, onClose, roomId, currentUser }: Props) {
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<string[]>([]);
  const [invited, setInvited] = useState<Record<string, boolean>>({});
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (!open) return;

    let alive = true;
    setLoading(true);

    listInvitableFriends({ currentUser, roomId })
      .then((names) => {
        if (!alive) return;
        setFriends(names || []);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [open, currentUser, roomId]);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return friends;
    return friends.filter((n) => n.toLowerCase().includes(k));
  }, [friends, keyword]);

  const handleInvite = async (to: string) => {
    try {
      setInvited((p) => ({ ...p, [to]: true }));
      await sendRoomInvite({ roomId, from: currentUser, to });
    } catch (e) {
      setInvited((p) => ({ ...p, [to]: false }));
      console.error(e);
      alert("Mời thất bại, thử lại!");
    }
  };

  if (!open) return null;

  return (
    <div
      className="inviteDrawer__backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <aside className="inviteDrawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="inviteDrawer__header">
          <div className="inviteDrawer__titleWrap">
            <div className="inviteDrawer__title">Mời bạn vào nhóm</div>
            <div className="inviteDrawer__subTitle">{roomId}</div>
          </div>

          <button className="inviteDrawer__close" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="inviteDrawer__searchWrap">
          <Search size={16} className="inviteDrawer__searchIcon" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm bạn bè..."
            className="inviteDrawer__searchInput"
          />
        </div>

        <div className="inviteDrawer__content">
          {loading ? (
            <div className="inviteDrawer__empty">Đang tải danh sách...</div>
          ) : filtered.length === 0 ? (
            <div className="inviteDrawer__empty">Không còn bạn nào để mời.</div>
          ) : (
            <div className="inviteDrawer__list">
              {filtered.map((name) => {
                const disabled = !!invited[name];
                return (
                  <div key={name} className="inviteDrawer__row">
                    <div className="inviteDrawer__avatar" aria-hidden>
                      {getInitials(name)}
                    </div>

                    <div className="inviteDrawer__meta">
                      <div className="inviteDrawer__name" title={name}>
                        {name}
                      </div>
                      <div className="inviteDrawer__hint">Bạn bè</div>
                    </div>

                    <button
                      className={`inviteDrawer__btn ${disabled ? "isDisabled" : ""}`}
                      disabled={disabled}
                      onClick={() => handleInvite(name)}
                    >
                      {disabled ? "Đã mời" : "Mời"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="inviteDrawer__footer">
          <div className="inviteDrawer__footerText">Chỉ hiển thị bạn bè chưa có trong nhóm.</div>
        </div>
      </aside>

    </div>
  );
}
