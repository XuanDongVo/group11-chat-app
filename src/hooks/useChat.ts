import { EmojiUtils } from "../utils/EmojiUtils";
import { useEffect, useState, useRef } from "react";
import { useWebSocket } from "../services/WebSocketContext";
import type { SidebarItemProps, ChatMessage } from "../types/chat";

function parseContent(raw: string) {
  if (!raw) {
    return { type: "text" as const, text: "" };
  }

  // ⚠️ REMOVE QUOTES + TRIM
  const normalized = raw.trim().replace(/^"(.*)"$/, "$1");

  if (normalized.startsWith("TEXT_IMAGE::")) {
    const payload = normalized.slice("TEXT_IMAGE::".length);

    const splitIndex = payload.indexOf("|");
    if (splitIndex === -1) {
      return {
        type: "text" as const,
        text: EmojiUtils.decode(payload),
      };
    }

    const text = payload.slice(0, splitIndex);
    const image = payload.slice(splitIndex + 1);

    return {
      type: "text_image" as const,
      text: EmojiUtils.decode(text),
      image,
    };
  }

  if (normalized.startsWith("IMAGE::")) {
    return {
      type: "image" as const,
      image: normalized.slice("IMAGE::".length),
    };
  }

  if (normalized.startsWith("TEXT::")) {
    return {
      type: "text" as const,
      text: EmojiUtils.decode(normalized.slice("TEXT::".length)),
    };
  }

  return {
    type: "text" as const,
    text: EmojiUtils.decode(normalized),
  };
}


function normalizePeopleMessages(raw: any): ChatMessage[] {
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.list)
    ? raw.list
    : Array.isArray(raw?.messages)
    ? raw.messages
    : Array.isArray(raw?.data?.data)
    ? raw.data.data
    : Array.isArray(raw?.data?.list)
    ? raw.data.list
    : Array.isArray(raw?.data?.messages)
    ? raw.data.messages
    : [];

  return list.map((m: any) => {
    const rawContent = m.mes ?? m.content ?? m.message ?? "";
     const isAudio = rawContent.startsWith("[AUDIO]");
    const content = isAudio 
      ? rawContent.substring(7) // Remove [AUDIO] prefix
      : EmojiUtils.decode(rawContent);

    const parsed = parseContent(rawContent);

    return {
      from: m.name ?? m.from ?? m.user ?? m.sender ?? "",
      to: m.to ?? m.receiver ?? "",
      type: parsed.type,
      text: parsed.text,
      image: parsed.image,
      time: m.createAt ?? m.time ?? m.createdAt ?? m.created_at ?? m.date ?? "",
    };
  });
}

export function useChat() {
  const { send, onMessage } = useWebSocket();

  // sidebar
  const [userList, setUserList] = useState<SidebarItemProps[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // conversation
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const currentUserRef = useRef<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const handleMessage = (message: { event: string; data?: any }) => {
      if (!message?.event) return;

      switch (message.event) {
        case "GET_USER_LIST": {
          setUserList(message.data || []);
          setLoadingUsers(false);
          break;
        }

        case "GET_PEOPLE_CHAT_MES": {
          const messages = normalizePeopleMessages(message.data);
          setMessages([...messages].reverse());
          setLoadingMessages(false);
          break;
        }

        case "SEND_CHAT": {
          const currentUser = currentUserRef.current;

          if (currentUser) {
            send({
              action: "onchat",
              data: {
                event: "GET_PEOPLE_CHAT_MES",
                data: { name: currentUser, page: 1 },
              },
            });
          }
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

  const selectUser = (username: string) => {
    setCurrentUser(username);
    currentUserRef.current = username;
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
  const sendToUser = (to: string, mes: string, isAudio?: boolean) => {
    // Nếu là audio, thêm prefix để dễ nhận biết khi nhận về
    const content = isAudio ? `[AUDIO]${mes}` : mes;
    
    send({
      action: "onchat",
      data: {
        event: "SEND_CHAT",
        data: {
          type: "people",
          to,
          mes: content,
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
