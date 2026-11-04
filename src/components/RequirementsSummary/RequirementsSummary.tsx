import type { RequirementQuestion } from "../RequirementsForm/RequirementsForm";
import "../ContactSummary/ContactSummary.css";

type RequirementsSummaryProps = {
  questions: RequirementQuestion[];
  values: Record<string, string>;
  title?: string;
};

export default function RequirementsSummary({
  questions,
  values,
  title = "Program requirements",
}: RequirementsSummaryProps) {
  return (
    <div className="contact-summary">
      <h2>{title}</h2>
      {questions.map((q) => (
        <div className="summary-row" key={q.id}>
          <span className="summary-label">{q.label}</span>
          <span className="summary-value">{values[q.id]}</span>
        </div>
      ))}
    </div>
  );
}
