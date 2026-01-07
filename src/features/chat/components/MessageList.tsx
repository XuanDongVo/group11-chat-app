import { useState, useMemo, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ImageLightbox from "../../../components/ui/ImageLightbox";
import type { ChatMessage } from "../../../types/chat";

const BOTTOM_THRESHOLD_PX = 120;

export default function MessageList({
  messages,
  activeChatId,
}: {
  messages: ChatMessage[];
  activeChatId?: string | null;
}) {
  const currentUser = localStorage.getItem("username");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior, block: "end" });
      if (listRef.current) {
        listRef.current.scrollTo({
          top: listRef.current.scrollHeight,
          behavior,
        });
      }
    });
  };

  // Detect scroll position
  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom <= BOTTOM_THRESHOLD_PX;

    setIsAtBottom(atBottom);
    setShowScrollBtn(!atBottom);

    if (atBottom) setUnreadCount(0);
  };

  useEffect(() => {
    setUnreadCount(0);
    setShowScrollBtn(false);
    setIsAtBottom(true);

    requestAnimationFrame(() => scrollToBottom("auto"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId]);

  const lastMsgKey = useMemo(() => {
    const last = messages[messages.length - 1] as any;
    return `${activeChatId ?? ""}::${messages.length}::${last?.id ?? ""}::${last?.createdAt ?? ""}::${last?.text ?? ""}`;
  }, [activeChatId, messages]);

  useEffect(() => {
    if (!listRef.current) return;

    if (isAtBottom) {
      scrollToBottom("smooth");
    } else {
      setShowScrollBtn(true);
      setUnreadCount((c) => c + 1);
    }

    const last = messages[messages.length - 1] as any;
    if (isAtBottom && (last?.type === "image" || last?.type === "text_image")) {
      const t = setTimeout(() => scrollToBottom("auto"), 120);
      return () => clearTimeout(t);
    }
  }, [lastMsgKey]); 

  // Extract all images from messages
  const allImages = useMemo(() => {
    return messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image as string);
  }, [messages]);

  const handleImageClick = (imageUrl: string) => {
    const imageIndex = allImages.indexOf(imageUrl);
    if (imageIndex !== -1) {
      setSelectedImageIndex(imageIndex);
      setLightboxOpen(true);
    }
  };

return (
  <>
    <div className="message-list-container" style={{ position: "relative" }}>
      <div className="chat-messages" ref={listRef} onScroll={handleScroll}>
        {messages.map((msg, idx) => {
          const sender = msg.from;
          const avatar = `https://i.pravatar.cc/100?u=${sender}`;
          return (
            <MessageBubble
              key={idx}
              message={msg}
              mine={sender === currentUser}
              onImageClick={handleImageClick}
              avatar={avatar}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      {showScrollBtn && (
        <button
          type="button"
          className="scroll-to-bottom-btn"
          onClick={() => {
            scrollToBottom("smooth");
            setUnreadCount(0);
            setShowScrollBtn(false);
            setIsAtBottom(true);
          }}
          aria-label="Cuộn xuống tin nhắn mới nhất"
          title="Cuộn xuống tin nhắn mới nhất"
        >
          ↓
          {unreadCount > 0 && (
            <span className="scroll-to-bottom-badge">{unreadCount}</span>
          )}
        </button>
      )}
    </div>

    {lightboxOpen && allImages.length > 0 && (
      <ImageLightbox
        images={allImages}
        initialIndex={selectedImageIndex}
        onClose={() => setLightboxOpen(false)}
      />
    )}
  </>
);

}
