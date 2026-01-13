import React, { useEffect, useMemo, useState } from "react";
import { listInvitableFriends, sendRoomInvite } from "../../../services/roomInviteService";

type Props = {
  open: boolean;
  onClose: () => void;
  roomId: string;        // ví dụ: "NLU_FE_GROUP11"
  currentUser: string;   // ví dụ: "duc"
};

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
      // optionally: toast / alert
    } catch (e) {
      setInvited((p) => ({ ...p, [to]: false }));
      console.error(e);
      alert("Mời thất bại, thử lại!");
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Mời bạn vào nhóm</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm bạn bè..."
            className="modal-search"
          />

          {loading ? (
            <div className="modal-empty">Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div className="modal-empty">Không còn bạn nào để mời.</div>
          ) : (
            <div className="invite-list">
              {filtered.map((name) => (
                <div key={name} className="invite-row">
                  <div className="invite-name">{name}</div>
                  <button
                    className="invite-btn"
                    disabled={!!invited[name]}
                    onClick={() => handleInvite(name)}
                  >
                    {invited[name] ? "Đã mời" : "Mời vào nhóm"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
