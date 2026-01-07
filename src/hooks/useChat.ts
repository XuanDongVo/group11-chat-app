import { EmojiUtils } from "../utils/EmojiUtils";
import { useEffect, useState, useRef } from "react";
import { useWebSocket } from "../services/WebSocketContext";
import type { SidebarItemProps, ChatMessage } from "../types/chat";

function parseContent(raw: string) {
  if (!raw) {
    return { type: "text" as const, text: "" };
  }
  const normalized = raw.trim().replace(/^"(.*)"$/, "$1");

  if (normalized.startsWith("[AUDIO]")) {
    return {
      type: "audio" as const,
      audio: normalized.substring(7),
    };
  }

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
    : Array.isArray(raw?.chatData)
    ? raw.chatData
    : Array.isArray(raw?.data?.chatData)
    ? raw.data.chatData
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
    const parsed = parseContent(rawContent);
    return {
      from: m.name ?? m.from ?? m.user ?? m.sender ?? "",
      to: m.to ?? m.receiver ?? "",
      type: parsed.type,
      text: parsed.text,
      image: parsed.image,
      audio: parsed.audio,
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

  /* ===== Search ===== */
  const [searchUsers, setSearchUsers] = useState<
    { name: string; avatar?: string }[]
  >([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchKeywordRef = useRef<string>("");

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
          const serverMessages = normalizePeopleMessages(
            message.data
          ).reverse();

          setMessages((prev) => {
            if (prev.length === 0) return serverMessages;
            return serverMessages;
          });

          setLoadingMessages(false);
          break;
        }

        case "GET_ROOM_CHAT_MES": {
          const serverMessages = normalizePeopleMessages(
            message.data
          ).reverse();

          setMessages((prev) => {
            if (prev.length === 0) return serverMessages;
            return serverMessages;
          });

          setLoadingMessages(false);
          break;
        }

        case "SEND_CHAT": {
          const partner = currentUserRef.current;
          if (!partner) break;

          send({
            action: "onchat",
            data: {
              event: "GET_PEOPLE_CHAT_MES",
              data: {
                name: partner,
                page: 1,
              },
            },
          });
          break;
        }

        case "CHECK_USER_EXIST": {
          const keyword = searchKeywordRef.current;

          if (message.data?.status === true && keyword) {
            setSearchUsers([
              {
                name: keyword,
                avatar: "https://i.pravatar.cc/36",
              },
            ]);
          } else {
            setSearchUsers([]);
          }

          setSearchLoading(false);
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

  const joinRoom = (roomName: string) => {
    send({
      action: "onchat",
      data: {
        event: "JOIN_ROOM",
        data: {
          name: roomName,
        },
      },
    });
  };

  const getRoomChatMessages = (roomName: string) => {
    setCurrentUser(roomName);
    currentUserRef.current = roomName;
    setLoadingMessages(true);
    setMessages([]);

    send({
      action: "onchat",
      data: {
        event: "GET_ROOM_CHAT_MES",
        data: {
          name: roomName,
          page: 1,
        },
      },
    });
  };

  const sendChatRoom = (roomName: string, mes: string) => {
    const parsed = parseContent(mes);
    const optimistic: ChatMessage = {
      from: loginUser,
      to: roomName,
      type: parsed.type,
      text: parsed.text,
      image: parsed.image,
      audio: parsed.audio,
      time: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    send({
      action: "onchat",
      data: {
        event: "SEND_CHAT",
        data: {
          type: "room",
          to: roomName,
          mes: mes,
        },
      },
    });
  };

  const checkUserExist = (username: string) => {
    searchKeywordRef.current = username;
    setSearchLoading(true);

    send({
      action: "onchat",
      data: {
        event: "CHECK_USER_EXIST",
        data: { user: username },
      },
    });
  };

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
  const loginUser = localStorage.getItem("username") || "";

  const sendToUser = (to: string, mes: string) => {
    const parsed = parseContent(mes);
    const optimistic: ChatMessage = {
      from: loginUser,
      to,
      type: parsed.type,
      text: parsed.text,
      image: parsed.image,
      audio: parsed.audio,
      time: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    send({
      action: "onchat",
      data: {
        event: "SEND_CHAT",
        data: {
          type: "people",
          to,
          mes: mes,
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

    checkUserExist,
    searchUsers,
    searchLoading,

    // optional
    sendToUser,
    getRoomChatMessages,
    sendChatRoom,
  };
}
