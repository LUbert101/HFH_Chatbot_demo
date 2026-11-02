import type { ReactNode } from "react";
import "./ChatMessage.css";

type ChatMessageProps = {
  children: ReactNode;
};

/** round icon on the left, speech bubble on the right. */
export default function ChatMessage({ children }: ChatMessageProps) {
  return (
    <div className="chat-message">
      <div className="chat-avatar" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3L12 3Z" />
        </svg>
      </div>
      <div className="chat-bubble">{children}</div>
    </div>
  );
}
