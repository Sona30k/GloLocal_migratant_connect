# backend.py
from flask import Flask, request, jsonify
from groq import Groq
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow frontend to call backend

client = Groq(api_key="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")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    prompt = data.get("message", "")

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}]
    )

    return jsonify({"reply": response.choices[0].message.content.strip()})

if __name__ == "__main__":
    app.run(debug=True)
