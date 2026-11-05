import type { ContactFormValues } from "../ContactForm/ContactForm";
import EditButton from "../EditButton/EditButton";
import "./ContactSummary.css";

type ContactSummaryProps = {
  values: ContactFormValues | "N/A";
  title?: string;
  onEdit?: () => void;
};

function buildRows(values: ContactFormValues) {
  const cityState = [values.city, values.state].filter(Boolean).join(", ");
  const location = [cityState, values.zip].filter(Boolean).join(" ");

  return [
    ["Name", `${values.firstName} ${values.lastName}`],
    ["Phone", values.phone],
    ["Email", values.email],
    ["Address", values.address || "Not provided"],
    ["City, State, Zip", location || "Not provided"],
  ];
}

export default function ContactSummary({
  values,
  title = "Your information",
  onEdit,
}: ContactSummaryProps) {
  const notApplicable = values === "N/A";
  const rows = notApplicable
    ? [
        ["Name", "N/A"],
        ["Phone", "N/A"],
        ["Email", "N/A"],
        ["Address", "N/A"],
        ["City, State, Zip", "N/A"],
      ]
    : buildRows(values);

  return (
    <div className="contact-summary">
      <div className="summary-header">
        <h2>{title}</h2>
        {onEdit && <EditButton label={title} onClick={onEdit} />}
      </div>
      {rows.map(([label, value]) => (
        <div className="summary-row" key={label}>
          <span className="summary-label">{label}</span>
          <span className="summary-value">{value}</span>
        </div>
      ))}
    </div>
  );
}
