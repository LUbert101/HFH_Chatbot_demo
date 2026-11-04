import Button from "../Button/Button";
import "./ChatInputBar.css";

type ChatInputBarProps = {
  disabled?: boolean;
};

export default function ChatInputBar({ disabled = true }: ChatInputBarProps) {
  return (
    <form className="chat-input-bar" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Type a message..."
        aria-label="Message"
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled}>
        Send
      </Button>
    </form>
  );
}
