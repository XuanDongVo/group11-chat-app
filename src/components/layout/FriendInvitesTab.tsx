
import type { FriendInvitesTabProps } from "../../types/FriendInvites";
import "../../styles/FriendInvites.css";

function FriendInvitesTab({ invites, onAccept, onReject }: FriendInvitesTabProps) {
    return (
        <div className="friend-invites-tab">
            {invites.length === 0 ? (
                <div className="no-invites">Không có lời mời kết bạn nào.</div>
            ) : (
                invites.map((invite) => (
                    <div className="invite-item" key={invite.id}>
                        <img className="invite-avatar" src={invite.avatar} alt={invite.name} />
                        <div className="invite-container">
                            <span className="invite-name">{invite.name}</span>
                            <div className="invite-actions">
                                <button className="accept-btn" onClick={() => onAccept(invite.id)}>Chấp nhận</button>
                                <button className="reject-btn" onClick={() => onReject(invite.id)}>Từ chối</button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}


export default FriendInvitesTab;
