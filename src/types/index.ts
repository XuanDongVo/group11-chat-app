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
