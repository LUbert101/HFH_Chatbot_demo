import { useEffect, useState } from "react";
import Button from "../Button/Button";
import ChatMessage from "../ChatMessage/ChatMessage";
import TypingDots from "../ChatMessage/TypingDots";
import "./ChatConversation.css";

type ChatConversationProps = {
  /** The bot's messages, shown one after another. */
  messages: string[];
  /** How long the "typing" dots show before each message appears. */
  typingDelayMs?: number;
  /** Called once the last message has appeared. */
  onFinish?: () => void;
};

export default function ChatConversation({
  messages,
  typingDelayMs = 3000,
  onFinish,
}: ChatConversationProps) {
  const [started, setStarted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  // The bot is "typing" whenever the chat has started and messages remain.
  const typing = started && visibleCount < messages.length;

  useEffect(() => {
    if (!typing) return;
    const timer = setTimeout(() => setVisibleCount((n) => n + 1), typingDelayMs);
    return () => clearTimeout(timer);
  }, [typing, visibleCount, typingDelayMs]);

  const finished = started && visibleCount >= messages.length;

  useEffect(() => {
    if (finished) onFinish?.();
  }, [finished, onFinish]);

  if (!started) {
    return (
      <div className="chat-start">
        <Button onClick={() => setStarted(true)}>Click here to get started</Button>
      </div>
    );
  }

  return (
    <div className="chat-conversation">
      {messages.slice(0, visibleCount).map((text) => (
        <ChatMessage key={text}>{text}</ChatMessage>
      ))}
      {typing && (
        <ChatMessage>
          <TypingDots />
        </ChatMessage>
      )}
    </div>
  );
}
