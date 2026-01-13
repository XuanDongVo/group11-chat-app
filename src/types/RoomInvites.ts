export interface RoomProps {
  username: string;
  onJoinRoom: (roomId: string) => void; // gọi joinRoom(roomId)
};

export interface InviteFriendsModalProps {
  open: boolean;
  onClose: () => void;
  roomId: string;        // ví dụ: "NLU_FE_GROUP11"
  currentUser: string;   // ví dụ: "duc"
};