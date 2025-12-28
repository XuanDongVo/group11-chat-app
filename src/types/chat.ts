// Chat Header
export interface ChatHeaderProps {
  avatar: string;
  name: string;
  status?: string;
}

// Message
export interface MessageBubbleProps {
  message: ChatMessage;
  mine?: boolean;
}

export interface ChatMessage {
  from: string;
  to: string;
  type: "text" | "image" | "text_image";
  text?: string;
  image?: string;
  time?: string;
}

// Sidebar
export interface SidebarItemProps {
  avatar: string;
  name: string;
  lastMessage: string;
  active?: boolean;
  time?: string;
  unread?: number;
}

// Sidebar Props
export interface SidebarProps {
  userList: SidebarItemProps[];
  loading: boolean;
  currentUser: string | null;
  onSelectUser: (username: string) => void;
}

// ChatLayout Props
export interface ChatLayoutProps {
  userList: SidebarItemProps[];
  loadingUsers: boolean;
  currentUser: string | null;
  messages: ChatMessage[];
  loadingMessages: boolean;
  selectUser: (username: string) => void;
}
