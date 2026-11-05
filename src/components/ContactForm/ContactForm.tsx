import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "../Button/Button";
import FieldMark, { RequiredKey } from "../FieldMark/FieldMark";
import "./ContactForm.css";

export type ContactFormValues = Record<string, string>;

type ContactFormProps = {
  onSubmit: (values: ContactFormValues) => void;
  addressOptional?: boolean;
  title?: string;
  initialValues?: ContactFormValues;
};

// States
const STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export default function ContactForm({
  onSubmit,
  addressOptional = false,
  title = "Your information",
  initialValues,
}: ContactFormProps) {
  // State
  const [complete, setComplete] = useState(Boolean(initialValues));
  const formRef = useRef<HTMLFormElement>(null);

  // Validity
  useEffect(() => {
    if (formRef.current) setComplete(formRef.current.checkValidity());
  }, [addressOptional]);

  // Submit
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as ContactFormValues;
    onSubmit(values);
  }

  return (
    <form
      ref={formRef}
      className="contact-form"
      onSubmit={handleSubmit}
      onChange={(event) => setComplete(event.currentTarget.checkValidity())}
    >
      <h2>{title}</h2>
      <RequiredKey />

      {/* Name */}
      <div className="field-row">
        <label className="field">
          <span>
            First name <FieldMark />
          </span>
          <input name="firstName" placeholder="John" defaultValue={initialValues?.firstName} type="text" autoComplete="given-name" required />
        </label>
        <label className="field">
          <span>
            Last name <FieldMark />
          </span>
          <input name="lastName" placeholder="Doe" defaultValue={initialValues?.lastName} type="text" autoComplete="family-name" required />
        </label>
      </div>

      {/* Phone */}
      <label className="field">
        <span>
            Phone # <FieldMark />
          </span>
        <input name="phone" placeholder="337-373-3773" defaultValue={initialValues?.phone} type="tel" pattern="\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}" autoComplete="tel" required />
      </label>

      {/* Email */}
      <label className="field">
        <span>
            Email <FieldMark />
          </span>
        <input name="email" placeholder="johnDoe@email.com" defaultValue={initialValues?.email} type="email" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" autoComplete="email" required />
      </label>

      {/* Address */}
      <label className="field">
        <span>
            Address <FieldMark optional={addressOptional} />
          </span>
        <input name="address" placeholder="123 West St" defaultValue={initialValues?.address} type="text" autoComplete="street-address" required={!addressOptional} />
      </label>

      {/* Location */}
      <div className="field-row field-row-3">
        <label className="field">
          <span>
            City <FieldMark optional={addressOptional} />
          </span>
          <input name="city" placeholder="Peoria" defaultValue={initialValues?.city} type="text" autoComplete="address-level2" required={!addressOptional} />
        </label>
        <label className="field">
          <span>
            State <FieldMark optional={addressOptional} />
          </span>
          <select name="state" autoComplete="address-level1" defaultValue={initialValues?.state ?? ""} required={!addressOptional}>
            <option value="" disabled={!addressOptional}>
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
          <span>
            Zip <FieldMark optional={addressOptional} />
          </span>
          <input
            name="zip"
            defaultValue={initialValues?.zip}
            type="text"
            inputMode="numeric"
            pattern="[0-9]{5}"
            maxLength={5}
            autoComplete="postal-code"
            required={!addressOptional}
          />
        </label>
      </div>

      {/* Button */}
      <Button type="submit" variant="success" disabled={!complete}>
        Submit
      </Button>
    </form>
  );
}
