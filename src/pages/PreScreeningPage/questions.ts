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
      showContact?: boolean;
    })
  | (StepBase & { type: "form"; next: string | null; title?: string })
  | (StepBase & { type: "requirements"; next: string | null })
  | (StepBase & { type: "household"; next: string | null });

// Flow
export const firstStepId = "housing";
export const closingMessage = "END OF DEMO";

// Contact
export const contactLabel = "Contact information";
export const contactMessage =
  "You can reach Habitat for Humanity Greater Peoria Area at: \n - (309) 676-6729 \n - 931 N Douglas, Peoria, IL 61606 \n - info@habitatpeoria.org";

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
      "Sweat Equity - Completing at least 250 hours of sweat equity per adult (age 18+), this includes volunteering on build sites, in the office or ReStore, or other approved tasks",
  },
  { label: "Workshops" },
  { label: "Partner" },
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
      { label: "Unstable housing", next: "housingDetails", reply: "Thanks for sharing that." },
    ],
  },
  {
    id: "housingDetails",
    type: "text",
    text: "Can you tell us a little about your situation? Share as much as you can.",
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
    text: "Next are the program requirements. Please answer each question in the form on the right.",
    next: "household",
  },
  {
    id: "household",
    type: "household",
    text: "Last up is housing information. Please fill out the form on the right.",
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

// Household
export const householdQuestions: HouseholdQuestions = {
  residency: {
    text: "Please state the current length of residency in the greater Peoria area:",
    note: "Disclaimer: Must be from greater Peoria area or your application may be affected",
  },
  adults: {
    text: "Please state the first and last name, as well as age of all adults in the household (not including yourself).",
    hint: "Use the \"+\" to add more information as needed.",
  },
  children: {
    text: "Please state the first and last name, as well as age of all children in the household.",
    hint: "Use the \"+\" to add more information as needed.",
  },
  taxes: {
    text: "Are all children listed claimed on your income tax?",
    hint: "Please note that children who are not claimed in your tax return are not a part of the household and should not be considered in the previous question.",
  },
  income: {
    text: "Please provide the average income of the household, ensuring that you list any other sources of income:",
  },
};

export const householdLabels = [
  { id: "residency", label: "Peoria residency" },
  { id: "adults", label: "Adults" },
  { id: "children", label: "Children" },
  { id: "taxes", label: "Claimed on taxes" },
  { id: "income", label: "Household income" },
];
