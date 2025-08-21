



from groq import Groq

# Create a client with your Groq API key
client = Groq(api_key="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")

def chat_with_groq(prompt):
    response = client.chat.completions.create(
        model="llama3-8b-8192",  # You can also try "mixtral-8x7b-32768"
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            break

        print("Chatbot:", chat_with_groq(user_input))
