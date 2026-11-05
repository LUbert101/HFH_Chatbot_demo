import { useState, type FormEvent } from "react";
import Button from "../Button/Button";
import FieldMark, { RequiredKey } from "../FieldMark/FieldMark";
import "../ContactForm/ContactForm.css";
import "./RequirementsForm.css";

export type RequirementQuestion = {
  id: string;
  label: string;
  text: string;
  allowOther?: boolean;
  note?: string;
};

type RequirementsFormProps = {
  questions: RequirementQuestion[];
  onSubmit: (values: Record<string, string>) => void;
  title?: string;
  initialValues?: Record<string, string>;
};

// Options
const OPTIONS = ["Yes", "No", "Other"];

export default function RequirementsForm({
  questions,
  onSubmit,
  title = "Program requirements",
  initialValues,
}: RequirementsFormProps) {
  // State
  const [choices, setChoices] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      Object.entries(initialValues ?? {}).map(([id, value]) => [
        id,
        value.startsWith("Other: ") ? "Other" : value,
      ])
    )
  );
  const [reasons, setReasons] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      Object.entries(initialValues ?? {})
        .filter(([, value]) => value.startsWith("Other: "))
        .map(([id, value]) => [id, value.slice("Other: ".length)])
    )
  );

  const complete = questions.every((q) => {
    const choice = choices[q.id];
    return choice && (choice !== "Other" || reasons[q.id]?.trim());
  });

  function pick(id: string, option: string) {
    setChoices((current) => ({
      ...current,
      [id]: current[id] === option ? "" : option,
    }));
  }

  // Submit
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(
      questions.map((q) => [
        q.id,
        choices[q.id] === "Other"
          ? `Other: ${reasons[q.id].trim()}`
          : choices[q.id],
      ])
    );
    onSubmit(values);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <RequiredKey />

      {questions.map((q, i) => (
        <fieldset className="requirement" key={q.id}>
          <legend>
            {i + 1}. {q.text} <FieldMark />
          </legend>

          {/* Options */}
          <div className="requirement-options">
            {(q.allowOther ? OPTIONS : OPTIONS.slice(0, 2)).map((option) => (
              <label className="requirement-option" key={option}>
                <input
                  type="checkbox"
                  checked={choices[q.id] === option}
                  onChange={() => pick(q.id, option)}
                />
                {option}
              </label>
            ))}
          </div>

          {/* Reason */}
          {choices[q.id] === "Other" && (
            <textarea
              className="requirement-reason"
              rows={3}
              placeholder="Please provide your reasoning..."
              value={reasons[q.id] ?? ""}
              onChange={(e) =>
                setReasons((current) => ({ ...current, [q.id]: e.target.value }))
              }
            />
          )}

          {/* Note */}
          {q.note && <p className="requirement-note">{q.note}</p>}
        </fieldset>
      ))}

      {/* Button */}
      <Button type="submit" variant="success" disabled={!complete}>
        Submit
      </Button>
    </form>
  );
}
