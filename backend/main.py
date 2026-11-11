from flask import Flask, request, jsonify, send_file
from docx import Document
import os
from flask_cors import CORS

# Path to the output Word document.
file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'output.docx')

# Flask application setup for handling pre-screening form submissions and saving to a Word document.
app = Flask(__name__)
CORS(app, origins=["http://localhost:5174"])
file_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "output.docx",
)

# Route to receive pre-screening form data and save it to a Word document.
@app.post("/prescreening")
def receive_prescreening():
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"error": "Expected JSON data"}), 400

    doc = Document(file_path) if os.path.exists(file_path) else Document()

    for key, title in [
        ("applicant", "Applicant"),
        ("answers", "Answers"),
        ("spouse", "Spouse or partner"),
        ("requirements", "Program requirements"),
        ("household", "Housing information"),
    ]:
        section = data.get(key)
        if section is None:
            continue

        doc.add_heading(title, level=2)
        if isinstance(section, dict):
            for field, value in section.items():
                doc.add_paragraph(f"{field}: {value}")
        else:
            doc.add_paragraph(str(section))

    doc.save(file_path)
    return jsonify({"saved": True, "file": "output.docx"})

# Start the Flask application when the script is run directly.
if __name__ == "__main__":
    app.run(port=8000)