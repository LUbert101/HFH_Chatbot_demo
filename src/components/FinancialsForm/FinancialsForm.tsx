import { useState, type FormEvent } from "react";
import Button from "../Button/Button";
import FieldMark, { RequiredKey } from "../FieldMark/FieldMark";
import "../ContactForm/ContactForm.css";
import "../RequirementsForm/RequirementsForm.css";
import "./FinancialsForm.css";

/* Financials form
    Asks how much they make monthly
    Additional radio button asking if they make any addtional sources of income
    if they click yes then it prompts to ask how much and from what source
 */

export type FinancialsDraft = {
  income: string;
  hasAdditional: string;
  additionalAmount: string;
  additionalSource: string;
};

type FinancialsFormProps = {
  onSubmit: (values: Record<string, string>, draft: FinancialsDraft) => void;
  title?: string;
  initialDraft?: FinancialsDraft;
};

// Numbers
function digits(value: string) {
  return value.replace(/[^0-9.]/g, "");
}

export default function FinancialsForm({
  onSubmit,
  title = "Financial information",
  initialDraft,
}: FinancialsFormProps) {
  // State
  const [income, setIncome] = useState(initialDraft?.income ?? "");
  const [hasAdditional, setHasAdditional] = useState(initialDraft?.hasAdditional ?? "");
  const [additionalAmount, setAdditionalAmount] = useState(
    initialDraft?.additionalAmount ?? ""
  );
  const [additionalSource, setAdditionalSource] = useState(
    initialDraft?.additionalSource ?? ""
  );

  const complete = Boolean(
    income &&
      hasAdditional &&
      (hasAdditional === "No" || additionalAmount)
  );

  // Submit
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const source = additionalSource.trim();
    onSubmit(
      {
        monthlyIncome: `$${income}`,
        additionalIncome:
          hasAdditional === "Yes"
            ? `Yes: $${additionalAmount}${source ? ` (${source})` : ""}`
            : "No",
      },
      { income, hasAdditional, additionalAmount, additionalSource }
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <RequiredKey />

      {/* Income */}
      <fieldset className="requirement">
        <legend>
          1. What is your gross monthly household income from your main income source?{" "}
          <FieldMark />
        </legend>
        <div className="field">
          <input
            inputMode="decimal"
            placeholder="2500"
            aria-label="Gross monthly income"
            value={income}
            onChange={(e) => setIncome(digits(e.target.value))}
          />
        </div>
      </fieldset>

      {/* Additional */}
      <fieldset className="requirement">
        <legend>
          2. Do you have any additional income outside of your main income source, such as
          Social Security, disability, child support, or alimony? <FieldMark />
        </legend>
        <div className="requirement-options">
          {["Yes", "No"].map((option) => (
            <label className="requirement-option" key={option}>
              <input
                type="radio"
                name="additional"
                checked={hasAdditional === option}
                onChange={() => setHasAdditional(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Amount */}
      {hasAdditional === "Yes" && (
        <fieldset className="requirement">
          <legend>
            3. About how much additional income do you receive per month? <FieldMark />
          </legend>
          <div className="financial-fields">
            <div className="field">
              <input
                inputMode="decimal"
                placeholder="300"
                aria-label="Additional monthly income"
                value={additionalAmount}
                onChange={(e) => setAdditionalAmount(digits(e.target.value))}
              />
            </div>
            <div className="field">
              <input
                placeholder="Source, such as child support"
                aria-label="Source of additional income"
                value={additionalSource}
                onChange={(e) => setAdditionalSource(e.target.value)}
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* Button */}
      <Button type="submit" variant="success" disabled={!complete}>
        Submit
      </Button>
    </form>
  );
}
