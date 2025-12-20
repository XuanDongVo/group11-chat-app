import './ChatPage.css';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isOnline?: boolean;
}

interface SidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

function Sidebar({ conversations, selectedConversation, onSelectConversation }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="app-logo">
          <span className="app-name">ChatFlow</span>
        </div>
      </div>

      <div className="search-box">
        <input type="text" placeholder="Tìm kiếm tin nhắn..." />
      </div>

      <div className="conversations-list">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation-item ${
              selectedConversation?.id === conversation.id ? 'active' : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="conversation-avatar">
              <span className="avatar-text">{conversation.avatar}</span>
              {conversation.isOnline && <span className="online-dot"></span>}
            </div>
            <div className="conversation-info">
              <div className="conversation-header">
                <span className="conversation-name">{conversation.name}</span>
                <span className="conversation-time">{conversation.time}</span>
              </div>
              <div className="conversation-preview">
                <span className="last-message">{conversation.lastMessage}</span>
                {conversation.unread && (
                  <span className="unread-badge">{conversation.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
