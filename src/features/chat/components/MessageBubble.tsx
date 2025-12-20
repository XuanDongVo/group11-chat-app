import clsx from "clsx";
import type { MessageBubbleProps } from "../../../types/chat";


export default function MessageBubble({ text, mine }: MessageBubbleProps) {
  return (
    <div className={clsx("message", mine && "mine")}>
      <p className="message__description">{text}</p>
    </div>
  );
}
