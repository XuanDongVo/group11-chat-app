export interface OffcanvasProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}
export interface FriendInvite {
    _docId?: string;
    name: string;
    avatar: string;
}

export interface FriendInvitesTabProps {
    invites: FriendInvite[];
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
}
