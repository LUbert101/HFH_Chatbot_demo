import EditButton from "../EditButton/EditButton";
import "../ContactSummary/ContactSummary.css";
import "./AnswerSummary.css";

type AnswerSummaryProps = {
  title: string;
  answer: string;
  onEdit?: () => void;
};

export default function AnswerSummary({ title, answer, onEdit }: AnswerSummaryProps) {
  return (
    <div className="contact-summary">
      <div className="summary-header">
        <h2>{title}</h2>
        {onEdit && <EditButton label={title} onClick={onEdit} />}
      </div>
      <p className="summary-answer">{answer}</p>
    </div>
  );
}
