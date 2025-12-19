import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import type { ChatPageProps, Conversation } from '../types';
import './ChatPage.css';

function ChatPage({ onLogout }: ChatPageProps) {
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      avatar: '👤',
      lastMessage: 'Hẹn gặp lại bạn nhé!',
      time: '2 phút',
      unread: 3,
      isOnline: true
    },
    {
      id: '2',
      name: 'Trần Thị B',
      avatar: '👤',
      lastMessage: 'Cảm ơn bạn nhiều',
      time: '15 phút',
      isOnline: false
    },
    {
      id: '3',
      name: 'Team Marketing',
      avatar: '👥',
      lastMessage: 'Đã gửi file báo cáo',
      time: '1 giờ',
      isOnline: false
    },
    {
      id: '4',
      name: 'Lê Văn C',
      avatar: '👤',
      lastMessage: 'Ok bạn ơi',
      time: '3 giờ',
      isOnline: false
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0]
  );

  return (
    <div className="chat-page">
      <Sidebar
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        onLogout={onLogout}
      />
      <ChatArea conversation={selectedConversation} />
    </div>
  );
}

export default ChatPage;
