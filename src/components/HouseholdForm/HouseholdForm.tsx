import { useState, type FormEvent } from "react";
import Button from "../Button/Button";
import FieldMark, { RequiredKey } from "../FieldMark/FieldMark";
import "../ContactForm/ContactForm.css";
import "../RequirementsForm/RequirementsForm.css";
import "./HouseholdForm.css";

type Question = {
  text: string;
  hint?: string;
  note?: string;
};

export type HouseholdQuestions = {
  residency: Question;
  adults: Question;
  children: Question;
};

export type Person = { first: string; last: string; age: string };

export type HouseholdDraft = {
  residency: string;
  adults: Person[];
  children: Person[];
};

type HouseholdFormProps = {
  questions: HouseholdQuestions;
  onSubmit: (values: Record<string, string>, draft: HouseholdDraft) => void;
  title?: string;
  initialDraft?: HouseholdDraft;
};

// Residency
const AMOUNTS = Array.from({ length: 50 }, (_, i) => String(i + 1));
const UNITS = ["Months", "Years"];

// People
const emptyPerson: Person = { first: "", last: "", age: "" };

function filled(person: Person) {
  return Boolean(person.first.trim() && person.last.trim() && person.age.trim());
}

function describe(person: Person) {
  return `${person.first.trim()} ${person.last.trim()} (${person.age.trim()})`;
}

function list(people: Person[]) {
  return people.length ? people.map(describe).join(", ") : "None";
}

type PersonListProps = {
  people: Person[];
  onChange: (people: Person[]) => void;
  label: string;
};

function PersonList({ people, onChange, label }: PersonListProps) {
  function update(index: number, key: keyof Person, value: string) {
    onChange(people.map((p, i) => (i === index ? { ...p, [key]: value } : p)));
  }

  return (
    <div className="person-list">
      {people.length === 0 && <p className="person-empty">None</p>}
      {people.map((person, i) => (
        <div className="person-row" key={i}>
          <input
            className="household-input"
            placeholder="First"
            aria-label={`${label} first name`}
            value={person.first}
            onChange={(e) => update(i, "first", e.target.value)}
          />
          <input
            className="household-input"
            placeholder="Last"
            aria-label={`${label} last name`}
            value={person.last}
            onChange={(e) => update(i, "last", e.target.value)}
          />
          <input
            className="household-input person-age"
            placeholder="Age"
            aria-label={`${label} age`}
            value={person.age}
            onChange={(e) => update(i, "age", e.target.value)}
          />
          <button
            type="button"
            className="person-remove"
            aria-label="Remove"
            onClick={() => onChange(people.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <Button variant="secondary" onClick={() => onChange([...people, emptyPerson])}>
        {people.length ? "+ Add another" : "+ Add"}
      </Button>
    </div>
  );
}

export default function HouseholdForm({
  questions,
  onSubmit,
  title = "Housing information",
  initialDraft,
}: HouseholdFormProps) {
  // State
  const [residencyAmount, setResidencyAmount] = useState(
    initialDraft?.residency.split(" ")[0] ?? ""
  );
  const [residencyUnit, setResidencyUnit] = useState(
    initialDraft?.residency.split(" ")[1] ?? "Years"
  );
  const [adults, setAdults] = useState<Person[]>(initialDraft?.adults ?? []);
  const [children, setChildren] = useState<Person[]>(initialDraft?.children ?? []);

  const residency = residencyAmount ? `${residencyAmount} ${residencyUnit}` : "";

  const complete = Boolean(
    residency &&
      adults.every(filled) &&
      children.every(filled)
  );

  // Submit
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(
      {
        residency,
        adults: list(adults),
        children: list(children),
      },
      { residency, adults, children }
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <RequiredKey />

      {/* Residency */}
      <fieldset className="requirement">
        <legend>
          1. {questions.residency.text} <FieldMark />
        </legend>
        <div className="field-row">
          <div className="field">
            <select
              aria-label="Length of residency"
              value={residencyAmount}
              onChange={(e) => setResidencyAmount(e.target.value)}
            >
              <option value="" disabled>
                --
              </option>
              {AMOUNTS.map((amount) => (
                <option key={amount} value={amount}>
                  {amount}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <select
              aria-label="Months or years"
              value={residencyUnit}
              onChange={(e) => setResidencyUnit(e.target.value)}
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
        {questions.residency.note && (
          <p className="requirement-note">{questions.residency.note}</p>
        )}
      </fieldset>

      {/* Adults */}
      <fieldset className="requirement">
        <legend>
          2. {questions.adults.text}
        </legend>
        {questions.adults.hint && (
          <p className="requirement-hint">{questions.adults.hint}</p>
        )}
        <PersonList people={adults} onChange={setAdults} label="Adult" />
      </fieldset>

      {/* Children */}
      <fieldset className="requirement">
        <legend>
          3. {questions.children.text}
        </legend>
        {questions.children.hint && (
          <p className="requirement-hint">{questions.children.hint}</p>
        )}
        <PersonList people={children} onChange={setChildren} label="Child" />
      </fieldset>

      {/* Button */}
      <Button type="submit" variant="success" disabled={!complete}>
        Submit
      </Button>
    </form>
  );
}
