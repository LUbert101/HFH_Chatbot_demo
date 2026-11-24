import type { ChatTone } from "../../components/ChatMessage/ChatMessage";
import type { HouseholdQuestions } from "../../components/HouseholdForm/HouseholdForm";
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
    })
  | (StepBase & { type: "form"; next: string | null; title?: string })
  | (StepBase & { type: "conditions"; next: string | null })
  | (StepBase & { type: "financials"; next: string | null })
  | (StepBase & { type: "requirements"; next: string | null })
  | (StepBase & { type: "household"; next: string | null });

// Flow
export const firstStepId = "housing";
export const closingMessages = [
  "Thank you for finishing your application! It has been sent to Habitat Peoria for a staff member to review. Each application is reviewed on a case-by-case basis.",
  "Habitat Peoria will be in contact via email, call, or text.\n\nQuestions? Contact us here:\n(309) 676-6729\ninfo@habitatpeoria.org",
];

// Clarify
export const clarifyLabel = "Clarify";

export type Clarification = {
  label: string;
  message?: string;
};

export const clarifications: Clarification[] = [
  {
    label: "Sweat Equity",
    message:
      "Sweat equity is time and labor you contribute, such as building on Habitat sites, helping in the office or ReStore, or other approved tasks, to earn part of your investment in a home instead of paying with cash. Habitat requires at least 250 hours per adult (age 18+) to be considered for the program.",
  },
  {
    label: "Workshops",
    message:
      "Workshops are the required homeowner education workshops. Homeowner applicants must complete them before closing on a home. The exact topics and schedule come from Habitat.",
  },
];

// Disclaimer
export const disclaimer =
  "Chatbot only collects information and does NOT make approval decisions. For any questions or concerns, please contact Habitat for Humanity Greater Peoria Area.";

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
    ],
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
    text: "Next are the program requirements. Please answer each question in the form on the right.",
    next: "household",
  },
  {
    id: "household",
    type: "household",
    text: "Next up is housing information. Please fill out the form on the right.",
    next: "taxes",
  },
  {
    id: "taxes",
    type: "choice",
    text: "Are all children listed claimed on your income tax?\nNote: Children who were not claimed on your tax returns for the last 2 years are not part of the household and should not be listed above.",
    choices: [
      { label: "Yes", next: "conditions" },
      { label: "No", next: "conditions" },
    ],
  },
  {
    id: "conditions",
    type: "conditions",
    text: "Which of these describe your current living conditions? Please check all that apply in the form on the right.",
    next: "financials",
  },
  {
    id: "financials",
    type: "financials",
    text: "Last up is financial information. Please fill out the form on the right.",
    next: null,
  },
];

// Financials
export const financialLabels = [
  { id: "monthlyIncome", label: "Monthly income" },
  { id: "additionalIncome", label: "Additional income" },
];

// Conditions
export const conditionOptions = [
  "Currently homeless or in temporary shelter",
  "Overcrowded living conditions",
  "Living in a home with major maintenance problems",
  "Living in an unsafe neighborhood or facing threats to personal safety",
  "Paying more than 30% of income toward rent or utilities",
  "Living in subsidized/public housing (Section 8, etc.)",
  "Other",
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

// Household
export const householdQuestions: HouseholdQuestions = {
  residency: {
    text: "Please state the current length of residency in the greater Peoria area:",
  },
  adults: {
    text: "Please state the first and last name, as well as age of all adults in the household (not including yourself).",
    hint: "Use the \"+\" to add more information as needed.",
  },
  children: {
    text: "Please state the first and last name, as well as age of all children in the household.",
    hint: "Use the \"+\" to add more information as needed.",
  },
};

export const householdLabels = [
  { id: "residency", label: "Peoria residency" },
  { id: "adults", label: "Adults" },
  { id: "children", label: "Children" },
];
