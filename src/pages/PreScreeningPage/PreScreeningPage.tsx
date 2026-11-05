import { useState } from "react";
import AnswerForm from "../../components/AnswerForm/AnswerForm";
import AnswerSummary from "../../components/AnswerSummary/AnswerSummary";
import Button from "../../components/Button/Button";
import ChatChoices from "../../components/ChatChoices/ChatChoices";
import ChatConversation, {
  type ChatLine,
} from "../../components/ChatConversation/ChatConversation";
import ContactForm, {
  type ContactFormValues,
} from "../../components/ContactForm/ContactForm";
import ContactSummary from "../../components/ContactSummary/ContactSummary";
import HouseholdForm, {
  type HouseholdDraft,
} from "../../components/HouseholdForm/HouseholdForm";
import RequirementsForm from "../../components/RequirementsForm/RequirementsForm";
import RequirementsSummary from "../../components/RequirementsSummary/RequirementsSummary";
import {
  clarifications,
  clarifyLabel,
  closingMessage,
  contactLabel,
  contactMessage,
  disclaimer,
  firstStepId,
  householdLabels,
  householdQuestions,
  requirementQuestions,
  steps,
} from "./questions";
import type { Clarification } from "./questions";
import "./PreScreeningPage.css";

type Stage = "intro" | "form" | "summary";

type Section = "applicant" | "housing" | "spouse" | "requirements" | "household";

const unstableLabel = "I have unstable housing / other";

// Messages
function bot(text: string): ChatLine {
  return { from: "bot", text };
}

function submitted(text: string, section: Section): ChatLine {
  return { from: "user", text, tone: "success", editKey: section };
}

const housingQuestion = steps.find((s) => s.id === "housingDetails")?.text;

const openingLines: ChatLine[] = [
  bot(
    "Hi, I'm the Habitat for Humanity chatbot, and I'll be here to assist you with your Pre-Screening application."
  ),
  { from: "bot", text: disclaimer, tone: "warning" },
  bot(
    "Lets get to know you! Go ahead and fill out form with your name, address, phone # and email!"
  ),
];

export default function PreScreeningPage() {
  // State
  const [stage, setStage] = useState<Stage>("intro");
  const [lines, setLines] = useState<ChatLine[]>(openingLines);
  const [applicant, setApplicant] = useState<ContactFormValues | null>(null);
  const [stepId, setStepId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [unstable, setUnstable] = useState(false);
  const [contactShown, setContactShown] = useState(false);
  const [spouse, setSpouse] = useState<ContactFormValues | null>(null);
  const [household, setHousehold] = useState<Record<string, string> | null>(null);
  const [householdDraft, setHouseholdDraft] = useState<HouseholdDraft | null>(null);
  const [editing, setEditing] = useState<Section | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [clarified, setClarified] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<Record<string, string> | null>(null);

  const step = steps.find((s) => s.id === stepId);

  // Questions
  function goTo(nextId: string | null, before: ChatLine[]) {
    const next = steps.find((s) => s.id === nextId);
    const intro = (next?.intro ?? []).map((l): ChatLine => ({ from: "bot", ...l }));
    setLines((current) => [
      ...current,
      ...before,
      ...intro,
      bot(next ? next.text : closingMessage),
    ]);
    setStepId(next ? next.id : null);
    setExpanded(false);
    if (next && next.type !== "choice" && next.type !== "text") setPanelOpen(true);
  }

  function handleForm(values: ContactFormValues) {
    console.log(values);
    setApplicant(values);
    setStage("summary");
    goTo(unstable ? "housingDetails" : firstStepId, [
      submitted("Personal information", "applicant"),
      bot(`Thanks, ${values.firstName}!`),
    ]);
  }

  function handleSpouse(values: ContactFormValues) {
    if (step?.type !== "form") return;
    setSpouse(values);
    goTo(step.next, [submitted("Spouse or partner information", "spouse")]);
  }

  function handleHousehold(values: Record<string, string>, draft: HouseholdDraft) {
    if (step?.type !== "household") return;
    setHousehold(values);
    setHouseholdDraft(draft);
    console.log({
      applicant,
      answers,
      spouse: answers.spouse === "No" ? "N/A" : spouse,
      requirements,
      household: values,
    });
    goTo(step.next, [submitted("Housing information", "household")]);
  }

  // Edit
  function startEdit(section: Section) {
    setEditing(section);
    setPanelOpen(true);
  }

  function cancelEdit() {
    setEditing(null);
    setExpanded(false);
  }

  function finishEdit(label: string, section: Section) {
    setEditing(null);
    setExpanded(false);
    setLines((current) => [...current, submitted(`${label} (updated)`, section)]);
  }

  function handleEditApplicant(values: ContactFormValues) {
    setApplicant(values);
    finishEdit("Personal information", "applicant");
  }

  function handleEditHousing(text: string) {
    setAnswers((current) => ({ ...current, housingDetails: text }));
    finishEdit("Unstable housing", "housing");
  }

  function handleEditSpouse(values: ContactFormValues) {
    setSpouse(values);
    finishEdit("Spouse or partner information", "spouse");
  }

  function handleEditRequirements(values: Record<string, string>) {
    setRequirements(values);
    finishEdit("Program requirements", "requirements");
  }

  function handleEditHousehold(values: Record<string, string>, draft: HouseholdDraft) {
    setHousehold(values);
    setHouseholdDraft(draft);
    finishEdit("Housing information", "household");
  }

  function handleRequirements(values: Record<string, string>) {
    if (step?.type !== "requirements") return;
    setRequirements(values);
    goTo(step.next, [submitted("Program requirements", "requirements")]);
  }

  function handleUnstable() {
    setUnstable(true);
    setAnswers((current) => ({ ...current, housing: unstableLabel }));
    setLines((current) => [
      ...current,
      { from: "user", text: unstableLabel },
      bot(
        "No problem. You can leave the address blank, and I'll ask about your situation after you submit."
      ),
    ]);
  }

  function handleClarify(item: Clarification) {
    const message = item.message;
    if (!message) return;
    setClarified((current) => [...current, item.label]);
    setLines((current) => [
      ...current,
      { from: "user", text: item.label },
      bot(message),
    ]);
  }

  function handleContact() {
    setContactShown(true);
    setLines((current) => [
      ...current,
      { from: "user", text: contactLabel },
      bot(contactMessage),
    ]);
  }

  function handleAnswer(text: string, nextId: string | null, reply?: string) {
    if (!step) return;
    const updated = { ...answers, [step.id]: text };
    setAnswers(updated);
    goTo(nextId, [
      { from: "user", text: text || "Skip" },
      ...(reply ? [bot(reply)] : []),
    ]);
  }

  const clarifyOptions = clarifications.filter((c) => !clarified.includes(c.label));

  return (
    <div className="prescreening">
      {/* Banner */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="title-banner">
            <h1>
              Pre-Screening
              <br />
              Application
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="content">
        <div className="container">
          <div
            className={`card ${stage !== "intro" ? "card-with-form" : ""} ${
              panelOpen ? "" : "card-panel-closed"
            } ${expanded ? "card-expanded" : ""}`}
          >
            {/* Chat */}
            <ChatConversation
              lines={lines}
              onFinish={() => setStage((s) => (s === "intro" ? "form" : s))}
              inputEnabled={step?.type === "text"}
              inputPlaceholder={step?.type === "text" ? step.placeholder : undefined}
              onSend={(text) => {
                if (step?.type === "text") handleAnswer(text, step.next);
              }}
              onLineClick={(key) => startEdit(key as Section)}
            >
              {stage === "form" && !unstable && (
                <ChatChoices options={[unstableLabel]} onPick={handleUnstable} />
              )}
              {step?.type === "choice" && (
                <ChatChoices
                  options={step.choices.map((c) => c.label)}
                  onPick={(i) =>
                    handleAnswer(
                      step.choices[i].label,
                      step.choices[i].next,
                      step.choices[i].reply
                    )
                  }
                />
              )}
              {step?.type === "requirements" && clarifyOptions.length > 0 && (
                <div className="chat-clarify">
                  <span className="chat-clarify-label">{clarifyLabel}</span>
                  <ChatChoices
                    options={clarifyOptions.map((c) => c.label)}
                    disabled={clarifyOptions.filter((c) => !c.message).map((c) => c.label)}
                    onPick={(i) => handleClarify(clarifyOptions[i])}
                  />
                </div>
              )}
              {step?.type === "text" && step.showContact && !contactShown && (
                <ChatChoices options={[contactLabel]} onPick={handleContact} />
              )}
            </ChatConversation>

            {/* Tab */}
            {stage !== "intro" && (
              <button
                type="button"
                className="panel-tab"
                aria-label={panelOpen ? "Hide information panel" : "Show information panel"}
                aria-expanded={panelOpen}
                onClick={() => setPanelOpen((open) => !open)}
              >
                {panelOpen ? "›" : "‹"}
              </button>
            )}

            {/* Form */}
            {stage !== "intro" && (
              <div className="form-panel">
                <div className="panel-bar">
                  <button
                    type="button"
                    className="panel-expand"
                    onClick={() => setExpanded((open) => !open)}
                  >
                    {expanded ? "Exit fullscreen" : "Fullscreen"}
                  </button>
                </div>
                {stage === "form" ? (
                  <>
                    <ContactForm onSubmit={handleForm} addressOptional={unstable} />
                    {expanded && !unstable && (
                      <div className="panel-unstable">
                        <ChatChoices options={[unstableLabel]} onPick={handleUnstable} />
                      </div>
                    )}
                  </>
                ) : editing === "applicant" && applicant ? (
                  <>
                    <ContactForm
                      key="edit-applicant"
                      title="Edit your information"
                      initialValues={applicant}
                      addressOptional={unstable}
                      onSubmit={handleEditApplicant}
                    />
                    <div className="edit-cancel">
                      <Button variant="secondary" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : editing === "housing" && answers.housingDetails ? (
                  <>
                    <AnswerForm
                      key="edit-housing"
                      title="Edit unstable housing"
                      question={housingQuestion}
                      initialValue={answers.housingDetails}
                      onSubmit={handleEditHousing}
                    />
                    <div className="edit-cancel">
                      <Button variant="secondary" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : editing === "spouse" && spouse ? (
                  <>
                    <ContactForm
                      key="edit-spouse"
                      title="Edit spouse or partner information"
                      initialValues={spouse}
                      addressOptional={unstable}
                      onSubmit={handleEditSpouse}
                    />
                    <div className="edit-cancel">
                      <Button variant="secondary" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : editing === "requirements" && requirements ? (
                  <>
                    <RequirementsForm
                      key="edit-requirements"
                      title="Edit program requirements"
                      questions={requirementQuestions}
                      initialValues={requirements}
                      onSubmit={handleEditRequirements}
                    />
                    <div className="edit-cancel">
                      <Button variant="secondary" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : editing === "household" && household && householdDraft ? (
                  <>
                    <HouseholdForm
                      key="edit-household"
                      title="Edit housing information"
                      questions={householdQuestions}
                      initialDraft={householdDraft}
                      onSubmit={handleEditHousehold}
                    />
                    <div className="edit-cancel">
                      <Button variant="secondary" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : step?.type === "form" ? (
                  <ContactForm
                    key={step.id}
                    title={step.title}
                    addressOptional={unstable}
                    onSubmit={handleSpouse}
                  />
                ) : step?.type === "household" ? (
                  <HouseholdForm
                    key={step.id}
                    questions={householdQuestions}
                    onSubmit={handleHousehold}
                  />
                ) : step?.type === "requirements" ? (
                  <RequirementsForm
                    key={step.id}
                    questions={requirementQuestions}
                    onSubmit={handleRequirements}
                  />
                ) : applicant ? (
                  <div className="summary-stack">
                    <ContactSummary
                      values={applicant}
                      onEdit={() => startEdit("applicant")}
                    />
                    {answers.housingDetails && (
                      <AnswerSummary
                        title="Unstable housing"
                        answer={answers.housingDetails}
                        onEdit={() => startEdit("housing")}
                      />
                    )}
                    {(spouse || answers.spouse === "No") && (
                      <ContactSummary
                        title="Spouse or partner"
                        values={spouse ?? "N/A"}
                        onEdit={spouse ? () => startEdit("spouse") : undefined}
                      />
                    )}
                    {requirements && (
                      <RequirementsSummary
                        questions={requirementQuestions}
                        values={requirements}
                        onEdit={() => startEdit("requirements")}
                      />
                    )}
                    {household && (
                      <RequirementsSummary
                        title="Housing information"
                        questions={householdLabels}
                        values={household}
                        onEdit={() => startEdit("household")}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
