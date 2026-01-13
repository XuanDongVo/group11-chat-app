import { useEffect, useState } from "react";
import {
  acceptRoomInvite,
  rejectRoomInvite,
  listenPendingRoomInvites,
  type RoomInvite,
} from "../../../services/roomInviteService";
import type { RoomProps } from "../../../types/RoomInvites";



export default function RoomInvitesBell({ username, onJoinRoom }: RoomProps) {
  const [open, setOpen] = useState(false);
  const [invites, setInvites] = useState<RoomInvite[]>([]);

  useEffect(() => {
    if (!username) return;
    const unsub = listenPendingRoomInvites(username, setInvites);
    return () => unsub?.();
  }, [username]);

  const count = invites.length;

  const handleAccept = async (invite: RoomInvite) => {
    await acceptRoomInvite({ inviteId: invite.id, roomId: invite.roomId, username });
    onJoinRoom(invite.roomId);
    setOpen(false);
  };

  const handleReject = async (invite: RoomInvite) => {
    await rejectRoomInvite(invite.id);
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((p) => !p)}>
        🔔
        {count > 0 && (
          <span className="badge">{count}</span>
        )}
      </button>

      {open && (
        <div className="invite-panel">
          <div className="invite-panel-title">Lời mời vào nhóm</div>

          {invites.length === 0 ? (
            <div className="empty">Không có lời mời.</div>
          ) : (
            invites.map((inv) => (
              <div key={inv.id} className="invite-item">
                <div>
                  <div><b>{inv.from}</b> mời bạn vào nhóm</div>
                  <div className="room">{inv.roomId}</div>
                </div>
                <div className="actions">
                  <button onClick={() => handleAccept(inv)}>Tham gia</button>
                  <button onClick={() => handleReject(inv)}>Từ chối</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
