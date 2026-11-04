import { useState, type FormEvent } from "react";
import Button from "../Button/Button";
import "./ChatTextInput.css";

type ChatTextInputProps = {
  placeholder?: string;
  optional?: boolean;
  multiline?: boolean;
  onSubmit: (text: string) => void;
};

export default function ChatTextInput({
  placeholder,
  optional = false,
  multiline = false,
  onSubmit,
}: ChatTextInputProps) {
  // State
  const [value, setValue] = useState("");

  // Submit
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = value.trim();
    if (!optional && !text) return;
    onSubmit(text);
  }

  return (
    <form className="chat-text-input" onSubmit={handleSubmit}>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows={3}
          required={!optional}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          required={!optional}
          autoFocus
        />
      )}
      <Button type="submit">Send</Button>
      {optional && (
        <Button variant="secondary" onClick={() => onSubmit("")}>
          Skip
        </Button>
      )}
    </form>
  );
}
