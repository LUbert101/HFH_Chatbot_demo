import EditButton from "../EditButton/EditButton";
import "../ContactSummary/ContactSummary.css";

type RequirementsSummaryProps = {
  questions: { id: string; label: string }[];
  values: Record<string, string>;
  title?: string;
  onEdit?: () => void;
};

export default function RequirementsSummary({
  questions,
  values,
  title = "Program requirements",
  onEdit,
}: RequirementsSummaryProps) {
  return (
    <div className="contact-summary">
      <div className="summary-header">
        <h2>{title}</h2>
        {onEdit && <EditButton label={title} onClick={onEdit} />}
      </div>
      {questions.map((q) => (
        <div className="summary-row" key={q.id}>
          <span className="summary-label">{q.label}</span>
          <span className="summary-value">{values[q.id]}</span>
        </div>
      ))}
    </div>
  );
}
