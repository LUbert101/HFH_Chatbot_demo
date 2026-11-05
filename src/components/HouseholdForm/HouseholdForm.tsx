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
  taxes: Question;
  income: Question;
};

export type Person = { first: string; last: string; age: string };

export type HouseholdDraft = {
  residency: string;
  adults: Person[];
  children: Person[];
  taxes: string;
  income: string;
};

type HouseholdFormProps = {
  questions: HouseholdQuestions;
  onSubmit: (values: Record<string, string>, draft: HouseholdDraft) => void;
  title?: string;
  initialDraft?: HouseholdDraft;
};

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
  const [residency, setResidency] = useState(initialDraft?.residency ?? "");
  const [adults, setAdults] = useState<Person[]>(initialDraft?.adults ?? []);
  const [children, setChildren] = useState<Person[]>(initialDraft?.children ?? []);
  const [taxes, setTaxes] = useState(initialDraft?.taxes ?? "");
  const [income, setIncome] = useState(initialDraft?.income ?? "");

  const complete = Boolean(
    residency.trim() &&
      adults.every(filled) &&
      children.every(filled) &&
      taxes &&
      income.trim()
  );

  // Submit
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(
      {
        residency: residency.trim(),
        adults: list(adults),
        children: list(children),
        taxes,
        income: income.trim(),
      },
      { residency, adults, children, taxes, income }
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
        <input
          className="household-input"
          value={residency}
          onChange={(e) => setResidency(e.target.value)}
        />
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

      {/* Taxes */}
      <fieldset className="requirement">
        <legend>
          4. {questions.taxes.text} <FieldMark />
        </legend>
        {questions.taxes.hint && (
          <p className="requirement-hint">{questions.taxes.hint}</p>
        )}
        <div className="requirement-options">
          {["Yes", "No"].map((option) => (
            <label className="requirement-option" key={option}>
              <input
                type="checkbox"
                checked={taxes === option}
                onChange={() => setTaxes(taxes === option ? "" : option)}
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Income */}
      <fieldset className="requirement">
        <legend>
          5. {questions.income.text} <FieldMark />
        </legend>
        <input
          className="household-input"
          inputMode="decimal"
          value={income}
          onChange={(e) => setIncome(e.target.value.replace(/[^0-9.]/g, ""))}
        />
      </fieldset>

      {/* Button */}
      <Button type="submit" variant="success" disabled={!complete}>
        Submit
      </Button>
    </form>
  );
}
