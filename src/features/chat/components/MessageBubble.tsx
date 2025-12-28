import clsx from "clsx";
import { Volume2 } from "lucide-react";
import type { MessageBubbleProps } from "../../../types/chat";


export default function MessageBubble({ text, mine, isAudio }: MessageBubbleProps) {
  // Check if message is an audio message (base64 data URI)
  const isAudioMessage = isAudio || text.startsWith("data:audio/");

  if (isAudioMessage) {
    return (
      <div className={clsx("message", "message--audio", mine && "mine")}>
        <div className="message__audio">
          <Volume2 size={16} className="audio-icon" />
          <audio src={text} controls className="audio-player" />
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("message", mine && "mine")}>
      <p className="message__description">{text}</p>
    </div>
  );
}
