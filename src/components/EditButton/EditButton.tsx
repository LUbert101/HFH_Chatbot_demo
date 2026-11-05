import "./EditButton.css";

type EditButtonProps = {
  label: string;
  onClick: () => void;
};

export default function EditButton({ label, onClick }: EditButtonProps) {
  return (
    <button
      type="button"
      className="edit-button"
      aria-label={`Edit ${label}`}
      title="Edit"
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25Zm17.7-10.2a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" />
      </svg>
    </button>
  );
}
