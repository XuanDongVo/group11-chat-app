import { useState } from 'react';
import type { ChatAreaProps, Message } from '../types';
import './ChatPage.css';

function ChatArea({ conversation }: ChatAreaProps) {
  const [messages] = useState<Message[]>([
    { id: '1', text: 'Xin chào! Bạn khỏe không?', time: '10:30', isMine: false },
    { id: '2', text: 'Chào bạn! Mình khỏe, còn bạn?', time: '10:32', isMine: true },
    { id: '3', text: 'Mình cũng ổn. Hôm nay có rảnh không?', time: '10:33', isMine: false },
    { id: '4', text: 'Có chứ, bạn cần gì không?', time: '10:35', isMine: true },
    { id: '5', text: 'Mình muốn hẹn gặp bạn để bàn về dự án mới', time: '10:36', isMine: false }
  ]);

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      console.log('Sending message:', inputMessage);
      // TODO: Send message via WebSocket
      setInputMessage('');
    }
  };

  if (!conversation) {
    return (
      <div className="chat-area">
        <div className="no-conversation">
          <span className="no-conversation-icon">💬</span>
          <p>Chọn một cuộc trò chuyện để bắt đầu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="chat-user-info">
          <span className="chat-avatar">{conversation.avatar}</span>
          <div className="chat-user-details">
            <h3 className="chat-user-name">{conversation.name}</h3>
            <span className="chat-user-status">
              {conversation.isOnline ? 'Đang hoạt động' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isMine ? 'message-mine' : 'message-other'}`}
          >
            <div className="message-bubble">
              <p className="message-text">{message.text}</p>
              <span className="message-time">{message.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="message-input-container">
        <form onSubmit={handleSendMessage} className="message-input-form">
          <button type="button" className="attach-button">📎</button>
          <button type="button" className="emoji-button">😊</button>
          <input
            type="text"
            className="message-input"
            placeholder="Nhập tin nhắn..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit" className="send-button">
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatArea;
