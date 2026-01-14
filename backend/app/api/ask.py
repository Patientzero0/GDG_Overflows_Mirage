from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
import numpy as np
import base64

from app.rag.embedder import embedder
from app.rag.retriever import retriever
from app.llm.groq_client import get_groq_response
from app.speech.tts_client import text_to_speech # Updated import

router = APIRouter()

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    text: str
    audio: str # base64 encoded audio

@router.post("/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    question = request.question
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        # 1. Generate embedding for the question
        query_embedding = embedder.generate_embeddings([question])
        
        # 2. Retrieve relevant chunks
        # The retriever should be loaded on startup, but we call load_index here for safety
        if retriever.index is None:
            retriever.load_index()
        
        retrieved_chunks = retriever.retrieve(query_embedding)
        
        # 3. Generate a teaching-style explanation using Groq
        llm_answer = get_groq_response(question, retrieved_chunks)
        
        # 4. Convert the explanation to audio
        audio_content = text_to_speech(llm_answer)
        
        # 5. Encode audio to base64
        audio_base64 = base64.b64encode(audio_content).decode('utf-8')
        
        # As per user request, text is returned for console logging on frontend
        return AskResponse(text=llm_answer, audio=audio_base64)

    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Knowledge base not found. Please run the data ingestion script.")
    except Exception as e:
        print(f"An error occurred in /ask endpoint: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred.")