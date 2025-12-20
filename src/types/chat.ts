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

// Sidebar
export interface SidebarItemProps {
  avatar: string;
  name: string;
  lastMessage: string;
  active?: boolean;
  time?: string;
  unread?: number;
}
