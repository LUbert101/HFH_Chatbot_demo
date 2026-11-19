import { useEffect, useRef, useState, type FormEvent } from "react";
import "./ChatInputBar.css";

type ChatInputBarProps = {
  disabled?: boolean;
  placeholder?: string;
  onSend?: (text: string) => void;
};

export default function ChatInputBar({
  disabled = true,
  placeholder = "Type a message...",
  onSend,
}: ChatInputBarProps) {
  // State
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus
  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  // Submit
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue("");
  }

  return (
    <form className="chat-input-bar" onSubmit={handleSubmit}>
      <div className="chat-input-wrap">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={disabled ? "Type a message..." : placeholder}
          aria-label="Message"
          disabled={disabled}
        />
        <button
          type="submit"
          className="chat-send"
          aria-label="Send"
          disabled={disabled || !value.trim()}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5,12 12,5 19,12" />
          </svg>
        </button>
      </div>
    </form>
  );
}
