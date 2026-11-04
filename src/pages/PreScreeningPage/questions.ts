import type { ChatTone } from "../../components/ChatMessage/ChatMessage";
import type { RequirementQuestion } from "../../components/RequirementsForm/RequirementsForm";

// Types
export type Choice = {
  label: string;
  next: string | null;
  reply?: string;
};

export type IntroLine = {
  text: string;
  tone?: ChatTone;
};

type StepBase = {
  id: string;
  text: string;
  intro?: IntroLine[];
};

export type Step =
  | (StepBase & { type: "choice"; choices: Choice[] })
  | (StepBase & {
      type: "text";
      next: string | null;
      placeholder?: string;
      optional?: boolean;
      multiline?: boolean;
      showContact?: boolean;
    })
  | (StepBase & { type: "form"; next: string | null; title?: string })
  | (StepBase & { type: "requirements"; next: string | null });

// Flow
export const firstStepId = "housing";
export const closingMessage = "END OF DEMO";

// Contact
export const contactLabel = "Contact information";
export const contactMessage =
  "You can reach Habitat for Humanity Greater Peoria Area at (309) 676-6729.";

// Disclaimer
const disclaimer =
  "Chatbot only collects information and does NOT make approval decisions. Please take any questions/concerns with Habitat for Humanity.";

// Steps
export const steps: Step[] = [
  {
    id: "housing",
    type: "choice",
    text: "What's your current housing situation?",
    choices: [
      { label: "Own my home", next: "spouse" },
      { label: "Rent", next: "spouse" },
      { label: "Live with family or friends", next: "spouse" },
      { label: "Unstable housing", next: "housingDetails", reply: "Thanks for sharing that." },
    ],
  },
  {
    id: "housingDetails",
    type: "text",
    intro: [{ text: disclaimer, tone: "warning" }],
    text: "Can you tell us a little about your situation? Share as much or as little as you'd like.",
    placeholder: "Tell us about your situation...",
    multiline: true,
    showContact: true,
    next: "spouse",
  },
  {
    id: "spouse",
    type: "choice",
    text: "Do you have a spouse or partner?",
    choices: [
      { label: "Yes", next: "spouseInfo" },
      { label: "No", next: "requirements" },
    ],
  },
  {
    id: "spouseInfo",
    type: "form",
    title: "Spouse or partner information",
    text: "Please fill out your spouse or partner's information in the form on the right.",
    next: "requirements",
  },
  {
    id: "requirements",
    type: "requirements",
    text: "Last up are the program requirements. Please answer each question in the form on the right.",
    next: null,
  },
];

// Requirements
export const requirementQuestions: RequirementQuestion[] = [
  {
    id: "savings",
    label: "Save $2,000",
    text: "Are you able to save at least $2,000 for down payment and/or insurance within 10 months?",
    allowOther: true,
  },
  {
    id: "sweatEquity",
    label: "Sweat equity",
    text: "Are you able to complete between 250-500 hours of sweat equity?",
    allowOther: true,
  },
  {
    id: "workshops",
    label: "Workshops",
    text: "Are you able to attend required workshops by HFH?",
    allowOther: true,
  },
  {
    id: "mortgage",
    label: "No-interest mortgage",
    text: "Are you able to partner with HFH to purchase a home with a no-interest mortgage?",
    allowOther: true,
  },
  {
    id: "citizenship",
    label: "Citizen / resident",
    text: "Are you a U.S. citizen or permanent resident?",
    note: "Disclaimer: Must be a U.S. citizen or permanent resident or your application may be affected",
  },
];
