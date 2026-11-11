# HFH_Chatbot_demo

## File Directory
```
main/
├ __pycache__/                       # Raw compiled Python from chatbot.py and main.py 
| ├ chatbot.cpython-314.pyc
| └ main.cpython-314.pyc
├ public/
| └ favicon.svg
├ src/                               # TypeScript (.tsx) and CSS files
| ├ components/
| | ├ AnswerForm/
| | | └ AnswerForm.css & .tsx
| | ├ AnswerSummary/
| | | └ AnswerSummary.css & .tsx
| | ├ Button/
| | | └ Button.css & .tsx
| | ├ ChatChoices/
| | | └ ChatChoices.css & .tsx
| | ├ ChatConversation/
| | | └ ChatConversation.css & .tsx
| | ├ ChatInputBar/
| | | └ ChatInputBar.css & .tsx
| | ├ ChatMessage/
| | | ├ ChatMessage.css & .tsx
| | | └ TypingDots.tsx               # Busy animation while chatbot "types"
| | ├ ChatTextInput/
| | | └ ChatTexInput.css & .tsx
| | ├ ContactForm/
| | | └ ContactForm.css & .tsx
| | ├ ContactSummary/
| | | └ ContactSummary.css & .tsx
| | ├ EditButton/
| | | └ EditButton.css & .tsx
| | ├ FieldMark/
| | | └ FieldMark.css & .tsx
| | ├ HouseholdForm/
| | | └ HouseholdForm.css & .tsx
| | ├ RequirementsForm/
| | | └ ReqiurementsForm.css & .tsx
| | └ RequirementsSummary/
| |   └ RequirementsSummary.tsx
| ├ pages/
| | └ PreScreeningPage/
| |   ├ PreScreeningPage.css & .tsx
| |   └ questions.ts                 # Chatbot questions & prompts for user input, plus some informational messages e.g. Habitat Peoria contact info
| ├ styles/                          # Global/root CSS properties & variables
| | ├ global.css
| | └ variables.css
| ├ App.tsx
| └ main.tsx                         # Renders the PreScreeningPage via App.tsx
├ .gitattributes
├ .gitignore
├ README.md                          # This file
├ chatbot.py                         # Python to run chatbot with decision tree and logic given user name and inputs
├ eslint.config.js
├ index.html                         # Highest-level HTML file to render, displaying header info and calling /src/main.tsx
├ main.py                            # Prototype of running chatbot and saving info to output.docx
├ output.docx                        # Exported info from chatbot conversation, ideally to be converted into standard Habitat Peoria pre-app. format
├ package-lock.json
├ package.json
├ tsconfig.app.json
├ tsconfig.json
├ tsconfig.node.json
└ vite.config.ts
```
