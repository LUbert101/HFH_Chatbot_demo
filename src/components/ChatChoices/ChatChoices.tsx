import Button from "../Button/Button";
import "./ChatChoices.css";

type ChatChoicesProps = {
  options: string[];
  disabled?: string[];
  onPick: (index: number) => void;
};

export default function ChatChoices({
  options,
  disabled = [],
  onPick,
}: ChatChoicesProps) {
  return (
    <div className="chat-choices">
      {options.map((label, i) => (
        <Button
          key={label}
          variant={disabled.includes(label) ? "secondary" : "primary"}
          disabled={disabled.includes(label)}
          onClick={() => onPick(i)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
