import type { FormEvent } from "react";
import Button from "../Button/Button";
import "./ContactForm.css";

export type ContactFormValues = Record<string, string>;

type ContactFormProps = {
  onSubmit: (values: ContactFormValues) => void;
};

const STATES = [
  "IL"
];

export default function ContactForm({ onSubmit }: ContactFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as ContactFormValues;
    onSubmit(values);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Your information</h2>

      <div className="field-row">
        <label className="field">
          First name
          <input name="firstName" type="text" autoComplete="given-name" required />
        </label>
        <label className="field">
          Last name
          <input name="lastName" type="text" autoComplete="family-name" required />
        </label>
      </div>

      <label className="field">
        Phone #
        <input name="phone" type="tel" autoComplete="tel" required />
      </label>

      <label className="field">
        Address
        <input name="address" type="text" autoComplete="street-address" required />
      </label>

      <div className="field-row field-row-3">
        <label className="field">
          City
          <input name="city" type="text" autoComplete="address-level2" required />
        </label>
        <label className="field">
          State
          <select name="state" autoComplete="address-level1" defaultValue="" required>
            <option value="" disabled>
              --
            </option>
            {STATES.map((abbr) => (
              <option key={abbr} value={abbr}>
                {abbr}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Zip
          <input
            name="zip"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{5}"
            maxLength={5}
            autoComplete="postal-code"
            required
          />
        </label>
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
