from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
import numpy as np
import base64
import json
import os
from datetime import datetime
from typing import Optional # NEW: Import Optional

from app.rag.embedder import embedder
from app.rag.retriever import retriever
from app.llm.groq_client import get_groq_response, get_sentiment, get_recommendation # Import get_sentiment, get_recommendation
from app.speech.tts_client import text_to_speech # Updated import
from app.config.settings import settings, BASE_DIR # NEW: Import BASE_DIR

CHAT_HISTORY_FILE = "backend/chat_history.json"

def append_chat_history(entry: dict):
    """Appends a new chat entry to the chat history JSON file."""
    history = []
    # Using a more robust path for chat_history.json relative to the project root
    chat_history_path = os.path.join(BASE_DIR, CHAT_HISTORY_FILE)
    if os.path.exists(chat_history_path):
        with open(chat_history_path, 'r', encoding='utf-8') as f:
            try:
                history = json.load(f)
            except json.JSONDecodeError:
                history = []
    
    history.append(entry)
    
    with open(chat_history_path, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=4, ensure_ascii=False)

router = APIRouter()

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    text: str
    audio: str # base64 encoded audio
    video_ids: list[str] # New field for video IDs
    sentiment: str # Categorical sentiment (e.g., 'Neutral')
    sentiment_score: float # Numerical sentiment (e.g., 0.0)
    recommendation: Optional[str] = None # New field for recommendation

@router.post("/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    question = request.question
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    print(f"\nUser Question: {question}")

    recommendation = None # Initialize recommendation
    
    try:
        # Determine sentiment of the question
        print("Determining sentiment of the question...")
        sentiment_category, sentiment_score = get_sentiment(question)
        print(f"Sentiment: {sentiment_category} (Score: {sentiment_score})")

        # 1. Generate embedding for the question
        print("Generating embedding for the question...")
        query_embedding = embedder.generate_embeddings([question])
        
        # 2. Retrieve relevant chunks
        print("Retrieving relevant chunks...")
        retrieved_chunks = retriever.retrieve(query_embedding)
        
        # Extract unique video IDs from retrieved chunks
        unique_video_ids = list(set([chunk['video_id'] for chunk in retrieved_chunks if 'video_id' in chunk]))
        print(f"Retrieved Chunks (first 3): {json.dumps(retrieved_chunks[:3], indent=2)}")
        print(f"Unique Video IDs from retrieved chunks: {unique_video_ids}")
        
        # 3. Generate a teaching-style explanation using Groq
        print("Generating LLM answer with Groq...")
        llm_answer = get_groq_response(question, retrieved_chunks)
        print(f"LLM Answer: {llm_answer}")
        
        # 4. Convert the explanation to audio
        print("Converting LLM answer to audio...")
        audio_content = text_to_speech(llm_answer)
        
        # 5. Encode audio to base64
        print("Encoding audio to base64...")
        audio_base64 = base64.b64encode(audio_content).decode('utf-8')
        print("Audio encoding complete.")
        
        # --- Recommendation Logic ---
        if sentiment_category == "Positive":
            print("User sentiment is Positive. Generating recommendation...")
            chat_history_path = os.path.join(BASE_DIR, CHAT_HISTORY_FILE)
            current_chat_history = []
            if os.path.exists(chat_history_path):
                with open(chat_history_path, 'r', encoding='utf-8') as f:
                    try:
                        current_chat_history = json.load(f)
                    except json.JSONDecodeError:
                        current_chat_history = []
            
            recommendation = get_recommendation(current_chat_history, llm_answer)
            if recommendation:
                print(f"Recommendation: {recommendation}")
            else:
                print("No suitable recommendation generated.")
        
        # Log chat history
        chat_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_prompt": question,
            "sentiment_category": sentiment_category,
            "sentiment_score": sentiment_score,
            "ai_response": llm_answer,
            "recommendation": recommendation # Include recommendation in chat history
        }
        try:
            append_chat_history(chat_entry)
            print("Chat history appended successfully.")
        except FileNotFoundError as fnfe_chat:
            print(f"ERROR: File not found when appending chat history: {fnfe_chat}")
        except Exception as e_chat:
            print(f"ERROR: An unexpected error occurred while appending chat history: {e_chat}")

        # As per user request, text is returned for console logging on frontend
        return AskResponse(text=llm_answer, audio=audio_base64, video_ids=unique_video_ids, sentiment=sentiment_category, sentiment_score=sentiment_score, recommendation=recommendation)

    except FileNotFoundError:
        print(f"ERROR: Knowledge base not found. Vector store path: {settings.VECTOR_STORE_PATH}. Please run the data ingestion script.")
        raise HTTPException(status_code=500, detail="Knowledge base not found. Please run the data ingestion script.")
    except Exception as e:
        print(f"An error occurred in /ask endpoint: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred.")