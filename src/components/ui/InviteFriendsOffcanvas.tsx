import { useEffect, useState } from "react";
import Offcanvas from "../../components/ui/Offcanvas";
import { getFriends } from "../../services/friendService";
import "../../styles/InviteFriendsOffcanvas.css";
import type { InviteFriendsProps } from "../../types/FriendInvites";


export default function InviteFriendsOffcanvas({
  open,
  onClose,
  onInvite,
  currentMembers,
  currentUser,
}: InviteFriendsProps) {
  const [friends, setFriends] = useState<{ name: string; avatar?: string }[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      getFriends(currentUser).then((data) => {
        setFriends(
          data.filter((f: any) => !currentMembers.includes(f.name))
        );
      });
      setSelected([]);
    }
  }, [open, currentUser, currentMembers]);

  const toggleSelect = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <Offcanvas open={open} onClose={onClose} title="Mời bạn vào nhóm">
      <div className="invite-friends-list">
        {friends.length === 0 ? (
          <div>Không còn bạn nào để mời.</div>
        ) : (
          friends.map((f) => (
            <div className="invite-friend-item" key={f.name}>
              <input
                className="invite-friend-checkbox"
                type="checkbox"
                checked={selected.includes(f.name)}
                onChange={() => toggleSelect(f.name)}
              />
              <img
                className="invite-friend-avatar"
                src={f.avatar || "https://i.pravatar.cc/36"}
                alt={f.name}
              />
              <span className="invite-friend-name">{f.name}</span>
            </div>
          ))
        )}
      </div>
      <button
        className="invite-friends-btn"
        disabled={selected.length === 0}
        onClick={() => onInvite(selected)}
      >
        Mời vào nhóm
      </button>
    </Offcanvas>
  );
}
