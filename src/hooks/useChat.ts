import { useEffect, useState } from "react";
import { useWebSocket } from "../services/WebSocketContext";
import type { SidebarItemProps, ChatMessage } from "../types/chat";

function normalizePeopleMessages(raw: any): ChatMessage[] {
  // server có thể trả về nhiều dạng: array trực tiếp, hoặc bọc trong data/list/messages...
  const list =
    Array.isArray(raw) ? raw :
    Array.isArray(raw?.data) ? raw.data :
    Array.isArray(raw?.list) ? raw.list :
    Array.isArray(raw?.messages) ? raw.messages :
    Array.isArray(raw?.data?.data) ? raw.data.data :
    Array.isArray(raw?.data?.list) ? raw.data.list :
    Array.isArray(raw?.data?.messages) ? raw.data.messages :
    [];

  return list.map((m: any) => ({
    from: m.from ?? m.user ?? m.sender ?? "",
    to: m.to ?? m.receiver ?? "",
    content: m.content ?? m.mes ?? m.message ?? "",
    time: m.time ?? m.createdAt ?? m.created_at ?? m.date ?? "",
  }));
}

export function useChat() {
  const { send, onMessage } = useWebSocket();

  // sidebar
  const [userList, setUserList] = useState<SidebarItemProps[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // conversation
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const handleMessage = (message: { event: string; data?: any }) => {
      // DEBUG: bật lên để biết server trả đúng event gì
      // console.log("WS MESSAGE:", message);

      switch (message.event) {
        case "GET_USER_LIST": {
          setUserList(message.data || []);
          setLoadingUsers(false);
          break;
        }

        case "GET_PEOPLE_CHAT_MES": {
          setMessages(normalizePeopleMessages(message.data));
          setLoadingMessages(false);
          break;
        }

        default:
          break;
      }
    };

    onMessage(handleMessage);

    // load sidebar lần đầu
    setLoadingUsers(true);
    send({
      action: "onchat",
      data: { event: "GET_USER_LIST" },
    });
  }, [send, onMessage]);

  // ✅ gọi khi click user ở sidebar: phải là GET_PEOPLE_CHAT_MES (không phải SEND_CHAT)
  const selectUser = (username: string) => {
    setCurrentUser(username);
    setLoadingMessages(true);
    setMessages([]);

    send({
      action: "onchat",
      data: {
        event: "GET_PEOPLE_CHAT_MES",
        data: {
          name: username,
          page: 1,
        },
      },
    });
  };

  // (tuỳ bạn dùng sau) gửi tin nhắn người-người theo sheet
  const sendToUser = (to: string, mes: string) => {
    send({
      action: "onchat",
      data: {
        event: "SEND_CHAT",
        data: {
          type: "people",
          to,
          mes,
        },
      },
    });
  };

  return {
    // sidebar
    userList,
    loadingUsers,

    // conversation
    currentUser,
    messages,
    loadingMessages,
    selectUser,

    // optional
    sendToUser,
  };
}
