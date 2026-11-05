import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "../Button/Button";
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
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={disabled ? "Type a message..." : placeholder}
        aria-label="Message"
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || !value.trim()}>
        Send
      </Button>
    </form>
  );
}
