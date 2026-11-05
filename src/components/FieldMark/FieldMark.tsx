import "./FieldMark.css";

type FieldMarkProps = {
  optional?: boolean;
};

export default function FieldMark({ optional = false }: FieldMarkProps) {
  return optional ? null : (
    <span className="required-mark" aria-hidden="true">
      *
    </span>
  );
}

export function RequiredKey() {
  return (
    <p className="required-key">
      <span className="required-mark">*</span> required
    </p>
  );
}
