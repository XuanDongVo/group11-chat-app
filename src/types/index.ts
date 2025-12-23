// WebSocket Message Types
export interface ChatMessage {
  action: string;
  data: {
    event: string;
    data: Record<string, unknown>;
  };
}

export interface LoginResponse {
  status: string;
  event: string;
  data: {
    RE_LOGIN_CODE: string;
  };
}

export interface ServerMessage {
  status?: string;
  event: string;
  data?: {
    RE_LOGIN_CODE?: string;
    [key: string]: unknown;
  };
  message?: string;
}

// Component Props
export interface LoginProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

export interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

export interface ChatPageProps {
  onLogout: () => void;
}

// Chat Related Interfaces
export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
}

export interface SidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onLogout: () => void;
}

export interface ChatAreaProps {
  conversation: Conversation | null;
}

// Message Handler Type
export type MessageHandler = (message: ServerMessage) => void;

export type EffectType =
  | "snow"
  | "confetti"
  | "stars"
  | "hearts"
  | "rain"
  | null;

export interface EffectsLayerProps {
  effect: EffectType;
}

export interface EffectPickerProps {
  onSelect: (effect: EffectType) => void;
  activeEffect: string | null;
}
