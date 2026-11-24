import { useState, type FormEvent } from "react";
import Button from "../Button/Button";
import "../ContactForm/ContactForm.css";
import "../RequirementsForm/RequirementsForm.css";
import "./ConditionsForm.css";


/* Living conditions form
    7 checkboxes of questions from the pre-screening app
    Other causes a text box for them to fill out
 */


export type ConditionsDraft = { selected: string[]; other: string };

type ConditionsFormProps = {
  options: string[];
  onSubmit: (text: string, draft: ConditionsDraft) => void;
  title?: string;
  initialDraft?: ConditionsDraft;
};

// Other
const OTHER = "Other";

export default function ConditionsForm({
  options,
  onSubmit,
  title = "Living conditions",
  initialDraft,
}: ConditionsFormProps) {
  // State
  const [selected, setSelected] = useState<string[]>(initialDraft?.selected ?? []);
  const [other, setOther] = useState(initialDraft?.other ?? "");

  const otherChecked = selected.includes(OTHER);
  const complete = !otherChecked || Boolean(other.trim());

  function toggle(option: string) {
    setSelected((current) =>
      current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option]
    );
  }

  // Submit
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const items = options
      .filter((o) => selected.includes(o))
      .map((o) => (o === OTHER ? `Other: ${other.trim()}` : o));
    onSubmit(items.length ? items.join("; ") : "None", { selected, other });
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>

      <fieldset className="requirement">
        <legend>Check all that apply:</legend>

        {/* Options */}
        <div className="condition-list">
          {options.map((option) => (
            <label className="requirement-option" key={option}>
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
              />
              {option}
            </label>
          ))}
        </div>

        {/* Reason */}
        {otherChecked && (
          <textarea
            className="requirement-reason"
            rows={3}
            placeholder="Please describe..."
            value={other}
            onChange={(e) => setOther(e.target.value)}
          />
        )}
      </fieldset>

      {/* Button */}
      <Button type="submit" variant="success" disabled={!complete}>
        Submit
      </Button>
    </form>
  );
}
