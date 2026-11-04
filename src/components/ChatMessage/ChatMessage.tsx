import type { ReactNode } from "react";
import "./ChatMessage.css";

export type ChatTone = "warning" | "alert";

type ChatMessageProps = {
  children: ReactNode;
  showAvatar?: boolean;
  from?: "bot" | "user";
  tone?: ChatTone;
};

/** round icon on the left, speech bubble on the right. */
export default function ChatMessage({
  children,
  showAvatar = true,
  from = "bot",
  tone,
}: ChatMessageProps) {
  if (from === "user") {
    return (
      <div className="chat-message chat-message-user">
        <div className="chat-bubble chat-bubble-user">{children}</div>
      </div>
    );
  }

  return (
    <div className="chat-message">
      {showAvatar ? (
        <div className="chat-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3L12 3Z" />
          </svg>
        </div>
      ) : (
        <div className="chat-avatar-spacer" />
      )}
      <div className={tone ? `chat-bubble chat-bubble-${tone}` : "chat-bubble"}>
        {children}
      </div>
    </div>
  );
}
