import { useState, useMemo } from "react";
import MessageBubble from "./MessageBubble";
import ImageLightbox from "../../../components/ui/ImageLightbox";
import type { ChatMessage } from "../../../types/chat";

export default function MessageList({
  messages,
}: {
  messages: ChatMessage[];
}) {
  const currentUser = localStorage.getItem("username");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
