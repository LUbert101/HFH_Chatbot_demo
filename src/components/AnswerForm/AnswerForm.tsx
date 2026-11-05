import { useState, type FormEvent } from "react";
import Button from "../Button/Button";
import "../ContactForm/ContactForm.css";
import "./AnswerForm.css";

type AnswerFormProps = {
  title: string;
  question?: string;
  initialValue: string;
  onSubmit: (text: string) => void;
};

export default function AnswerForm({
  title,
  question,
  initialValue,
  onSubmit,
}: AnswerFormProps) {
  // State
  const [value, setValue] = useState(initialValue);

  // Submit
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(value.trim());
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>
      {question && <p className="answer-question">{question}</p>}
      <textarea
        className="answer-input"
        rows={6}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit" variant="success" disabled={!value.trim()}>
        Submit
      </Button>
    </form>
  );
}
