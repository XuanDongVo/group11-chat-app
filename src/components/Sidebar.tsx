import type { SidebarProps } from '../types';
import './ChatPage.css';

function Sidebar({ conversations, selectedConversation, onSelectConversation, onLogout }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="app-logo">
          <span className="app-name">ChatFlow</span>
        </div>
        <button className="logout-button" onClick={onLogout} title="Đăng xuất">
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>

      <div className="search-box">
        <i className="bi bi-search search-icon"></i>
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
