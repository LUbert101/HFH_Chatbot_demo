from docx import Document
import os
from chatbot import start_chat

file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'output.docx')

def add_info(doc, first_name, last_name):
    doc.add_heading(f'{first_name} {last_name}', level=2)

def main():
    print("Welcome to the Master Control Program.")
    print("Initializing systems...")
    print("-" * 30)

    if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
        doc = Document(file_path)
    else:
        if os.path.exists(file_path):
            print('File is empty. Creating a new document.')
        else:
            print('File does not exist. Creating a new document.')
        doc = Document()

    first_name, last_name = start_chat()
    add_info(doc, first_name, last_name)
    doc.save(file_path)

    print("\nSystem returning to standby mode.")

if __name__ == "__main__":
    main()