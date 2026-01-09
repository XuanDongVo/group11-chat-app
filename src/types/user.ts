import type { EffectType } from "./index";

export interface HeaderProps {
  username: string;
  onLogout: () => void;
  onChangeEffect: (effect: EffectType) => void;
}

export type User = {
  name: string;
  avatar?: string;
};

export type UserListProps = {
  users: User[];
  activeUser: string;
  onSelectUser: (name: string) => void;
};

export interface AddFriendModalProps {
  open: boolean;
  onClose: () => void;
  currentUser: string;
}
