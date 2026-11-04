import { useState } from "react";
import ChatChoices from "../../components/ChatChoices/ChatChoices";
import ChatConversation, {
  type ChatLine,
} from "../../components/ChatConversation/ChatConversation";
import ChatTextInput from "../../components/ChatTextInput/ChatTextInput";
import ContactForm, {
  type ContactFormValues,
} from "../../components/ContactForm/ContactForm";
import ContactSummary from "../../components/ContactSummary/ContactSummary";
import RequirementsForm from "../../components/RequirementsForm/RequirementsForm";
import RequirementsSummary from "../../components/RequirementsSummary/RequirementsSummary";
import {
  closingMessage,
  contactLabel,
  contactMessage,
  firstStepId,
  requirementQuestions,
  steps,
} from "./questions";
import "./PreScreeningPage.css";

type Stage = "intro" | "form" | "summary";

const unstableLabel = "I have unstable housing / other";

// Messages
const botMessages = [
  "Hi, I'm the Habitat for Humanity chatbot, and I'll be here to assist you with your Pre-Screening application.",
  "Lets get to know you! Go ahead and fill out form with your name, address, phone # and email!",
];

function bot(text: string): ChatLine {
  return { from: "bot", text };
}

export default function PreScreeningPage() {
  // State
  const [stage, setStage] = useState<Stage>("intro");
  const [lines, setLines] = useState<ChatLine[]>(botMessages.map(bot));
  const [applicant, setApplicant] = useState<ContactFormValues | null>(null);
  const [stepId, setStepId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [unstable, setUnstable] = useState(false);
  const [contactShown, setContactShown] = useState(false);
  const [spouse, setSpouse] = useState<ContactFormValues | null>(null);
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
  }

  function handleForm(values: ContactFormValues) {
    console.log(values);
    setApplicant(values);
    setStage("summary");
    goTo(unstable ? "housingDetails" : firstStepId, [
      bot(`Thanks, ${values.firstName}!`),
    ]);
  }

  function handleSpouse(values: ContactFormValues) {
    if (step?.type !== "form") return;
    setSpouse(values);
    goTo(step.next, []);
  }

  function handleRequirements(values: Record<string, string>) {
    if (step?.type !== "requirements") return;
    setRequirements(values);
    console.log({
      applicant,
      answers,
      spouse: answers.spouse === "No" ? "N/A" : spouse,
      requirements: values,
    });
    goTo(step.next, []);
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
          <div className={`card ${stage !== "intro" ? "card-with-form" : ""}`}>
            {/* Chat */}
            <ChatConversation
              lines={lines}
              onFinish={() => setStage((s) => (s === "intro" ? "form" : s))}
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
              {step?.type === "text" && (
                <div className="chat-answer">
                  {step.showContact && !contactShown && (
                    <ChatChoices options={[contactLabel]} onPick={handleContact} />
                  )}
                  <ChatTextInput
                    key={step.id}
                    placeholder={step.placeholder}
                    optional={step.optional}
                    multiline={step.multiline}
                    onSubmit={(text) => handleAnswer(text, step.next)}
                  />
                </div>
              )}
            </ChatConversation>

            {/* Form */}
            {stage === "form" && (
              <div className="form-panel">
                <ContactForm onSubmit={handleForm} addressOptional={unstable} />
              </div>
            )}
            {stage === "summary" && applicant && (
              <div className="form-panel">
                {step?.type === "form" ? (
                  <ContactForm
                    key={step.id}
                    title={step.title}
                    addressOptional={unstable}
                    onSubmit={handleSpouse}
                  />
                ) : step?.type === "requirements" ? (
                  <RequirementsForm
                    key={step.id}
                    questions={requirementQuestions}
                    onSubmit={handleRequirements}
                  />
                ) : (
                  <div className="summary-stack">
                    <ContactSummary values={applicant} />
                    {(spouse || answers.spouse === "No") && (
                      <ContactSummary
                        title="Spouse or partner"
                        values={spouse ?? "N/A"}
                      />
                    )}
                    {requirements && (
                      <RequirementsSummary
                        questions={requirementQuestions}
                        values={requirements}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
