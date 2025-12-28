// Chat Header
export interface ChatHeaderProps {
  avatar: string;
  name: string;
  status?: string;
}

// Message
export interface MessageBubbleProps {
  text: string;
  mine?: boolean;
}

export interface ChatMessage {
  from: string;
  to: string;
  content: string;
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
