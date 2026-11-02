import { useState } from "react";
import ChatConversation from "../../components/ChatConversation/ChatConversation";
import ContactForm from "../../components/ContactForm/ContactForm";
import "./PreScreeningPage.css";

// The bot's messages, in the order they appear. Add or edit lines here.
const botMessages = [
  "Hi, I'm the Habitat for Humanity chatbot, and I'll be here to assist you with your Pre-Screening application.",
  "Lets get to know you! Go ahead and fill out form with your name, address, phone # and email!",
];

export default function PreScreeningPage() {
  // The form slides in on the right once the chatbot finishes talking
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="prescreening">
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

      <main className="content">
        <div className="container">
          <div className={`card ${showForm ? "card-with-form" : ""}`}>
            <ChatConversation
              messages={botMessages}
              onFinish={() => setShowForm(true)}
            />
            {showForm && (
              <div className="form-panel">
                <ContactForm onSubmit={(values) => console.log(values)} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
