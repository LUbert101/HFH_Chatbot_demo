import Button from "../Button/Button";
import "./ChatChoices.css";

type ChatChoicesProps = {
  options: string[];
  onPick: (index: number) => void;
};

export default function ChatChoices({ options, onPick }: ChatChoicesProps) {
  return (
    <div className="chat-choices">
      {options.map((label, i) => (
        <Button key={label} onClick={() => onPick(i)}>
          {label}
        </Button>
      ))}
    </div>
  );
}
