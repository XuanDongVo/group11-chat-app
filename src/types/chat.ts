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
  isAudio?: boolean;
}

export interface MessageBubblePropsExtended extends MessageBubbleProps {
  avatar?: string;
  onImageClick?: (imageUrl: string) => void;
}

// Image Lightbox
export interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export interface ChatMessage {
  from: string;
  to: string;
  type: "text" | "image" | "text_image" | "audio";
  text?: string;
  image?: string;
  audio?: string;
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
  checkUserExist: (username: string) => void;
  searchUsers: { name: string; avatar?: string }[];
  searchLoading: boolean;
}

// ChatLayout Props
export interface ChatLayoutProps {
  userList: SidebarItemProps[];
  loadingUsers: boolean;
  currentUser: string | null;
  messages: ChatMessage[];
  loadingMessages: boolean;
  selectUser: (username: string) => void;
  sendToUser: (username: string, message: string, isAudio?: boolean) => void;
  checkUserExist: (username: string) => void;
}


