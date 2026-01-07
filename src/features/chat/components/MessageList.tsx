import { useState, useMemo, useLayoutEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ImageLightbox from "../../../components/ui/ImageLightbox";
import type { ChatMessage } from "../../../types/chat";

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

  const lastMsgKey = useMemo(() => {
    const last = messages[messages.length - 1];
    return `${activeChatId ?? ""}::${messages.length}::${(last as any)?.id ?? ""}::${(last as any)?.createdAt ?? ""}::${last?.text ?? ""}`;
  }, [activeChatId, messages]);

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    // double-tick để chắc DOM render xong
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior, block: "end" });
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      });
    });
  };

  useLayoutEffect(() => {
    scrollToBottom("auto");
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
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            message={msg}
            mine={msg.from === currentUser}
            onImageClick={handleImageClick}
          />
        ))}
        <div ref={bottomRef} />
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
