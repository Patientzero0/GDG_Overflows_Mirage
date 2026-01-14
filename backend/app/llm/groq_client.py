from groq import Groq
from app.config.settings import settings

def get_groq_response(question: str, context: list[str]) -> str:
    """
    Generates a response from the Groq API based on a question and context.
    """
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    context_str = "\n".join(context)
    
    prompt = f"""
    You are a helpful teaching assistant. Based on the following context from a lecture transcript,
    provide a clear and concise explanation to answer the user's question.
    Present the answer in a teaching style, similar to how a teacher would explain a concept to a student,
    but be direct and avoid conversational filler, direct questions to the student, or explicit pauses for response.
    Focus solely on explaining the concept effectively without asking questions or prompting for interaction.

    Context:
    ---
    {context_str}
    ---
    
    Question: {question}
    
    Answer:
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant", # Or another suitable model on Groq
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return "I'm sorry, I encountered an error while trying to generate a response."