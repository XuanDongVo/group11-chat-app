export interface CreateRoomModalProps {
  open: boolean;
  onClose: () => void;
}

export interface RoomState {
  rooms: string[];
  currentRoom: string | null;
  status: 'idle' | 'loading' | 'error';
  error?: string;
}