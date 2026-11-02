CHATBOT_TREE = {
    "start": {
        "text": "Hello! How can I help you today?",
        "choices": {"1": ("Tech Support", "tech_issue"), "2": ("Billing Questions", "billing_issue")}
    },
    "tech_issue": {
        "text": "Try restarting your device. Did that work?",
        "choices": {"1": ("Yes", "success_end"), "2": ("No", "human_end")}
    },
    "billing_issue": {
        "text": "Please wait while we pull up your account...",
        "choices": {}
    },
    "success_end": {"text": "Great! Have an awesome day.", "choices": {}},
    "human_end": {"text": "Connecting you to an agent...", "choices": {}}
}

def start_chat():
    """Starts the decision tree chatbot sequence."""
    first_name = input("First name: ").strip()
    last_name = input("Last name: ").strip()

    current_node_id = "start"
    print("--- Chatbot Session Started ---\n")

    while True:
        node = CHATBOT_TREE[current_node_id]
        text = node["text"]

        if current_node_id == "start":
            text = f"Hello, {first_name} {last_name}! How can I help you today?"

        print(f"Bot: {text}")

        if not node["choices"]:
            print("\n--- End of Chat ---")
            break

        for key, (choice_text, _) in node["choices"].items():
            print(f"  [{key}] {choice_text}")

        user_input = input("\nYou: ").strip()

        if user_input in node["choices"]:
            current_node_id = node["choices"][user_input][1]
            print("-" * 30)
        else:
            print("\n[Invalid selection. Try again.]")
            print("-" * 30)

    return first_name, last_name