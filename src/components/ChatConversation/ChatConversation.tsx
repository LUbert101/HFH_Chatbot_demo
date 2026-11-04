import { useEffect, useRef, useState, type ReactNode } from "react";
import Button from "../Button/Button";
import ChatInputBar from "../ChatInputBar/ChatInputBar";
import ChatMessage, { type ChatTone } from "../ChatMessage/ChatMessage";
import TypingDots from "../ChatMessage/TypingDots";
import "./ChatConversation.css";

export type ChatLine = {
  from: "bot" | "user";
  text: string;
  tone?: ChatTone;
};

type ChatConversationProps = {
  lines: ChatLine[];
  typingDelayMs?: number;
  onFinish?: () => void;
  children?: ReactNode;
};

export default function ChatConversation({
  lines,
  typingDelayMs = 2000,
  onFinish,
  children,
}: ChatConversationProps) {
  // State
  const [started, setStarted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  // Typing
  const pending = started && visibleCount < lines.length;
  const typing = pending && lines[visibleCount].from === "bot";

  useEffect(() => {
    if (!pending) return;
    const delay = typing ? typingDelayMs : 0;
    const timer = setTimeout(() => setVisibleCount((n) => n + 1), delay);
    return () => clearTimeout(timer);
  }, [pending, typing, visibleCount, typingDelayMs]);

  // Finish
  const finished = started && visibleCount >= lines.length;

  useEffect(() => {
    if (finished) onFinish?.();
  }, [finished, onFinish]);

  // Scroll
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [visibleCount, typing, finished]);

  // Dock
  const conversationRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dock = dockRef.current;
    const box = conversationRef.current;
    if (!dock || !box) return;
    const update = () =>
      box.style.setProperty("--dock-height", `${dock.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(dock);
    return () => observer.disconnect();
  }, [started]);

  // Start
  if (!started) {
    return (
      <div className="chat-start">
        <Button onClick={() => setStarted(true)}>Click here to get started</Button>
      </div>
    );
  }

  // Messages
  const shown = lines.slice(0, visibleCount);
  const lastIsBot = shown[shown.length - 1]?.from === "bot";

  return (
    <div className="chat-conversation" ref={conversationRef}>
      <div className="chat-messages" ref={messagesRef}>
        {shown.map((line, i) => (
          <ChatMessage
            key={i}
            from={line.from}
            tone={line.tone}
            showAvatar={shown[i - 1]?.from !== "bot"}
          >
            {line.text}
          </ChatMessage>
        ))}
        {typing && (
          <ChatMessage showAvatar={!lastIsBot}>
            <TypingDots />
          </ChatMessage>
        )}
      </div>
      <div className="chat-dock" ref={dockRef}>
        {finished && children}
        <ChatInputBar />
      </div>
    </div>
  );
}
