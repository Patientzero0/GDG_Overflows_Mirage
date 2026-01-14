# Teacher RAG System - Setup & Usage Guide

## Overview
This is a FREE-TIER optimized Retrieval-Augmented Generation (RAG) teaching assistant that uses:
- **FastAPI** backend with local embeddings (no API calls for embeddings)
- **React** frontend with minimal UI
- **Groq API** for final answer generation (ONE call per question)
- **Google Text-to-Speech** for audio output
- **FAISS** for vector storage

## Quick Start

### 1. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API keys:
# GROQ_API_KEY=your_groq_api_key
# GOOGLE_TTS_API_KEY=your_google_tts_key
# YOUTUBE_API_KEY=your_youtube_api_key

# Run data ingestion (creates local knowledge base)
python ingest_data.py

# Start the backend server
uvicorn app.main:app --reload
```

Backend runs on: **http://localhost:8000**

### 2. Frontend Setup
```bash
cd frontend/frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Frontend runs on: **http://localhost:3000**

## How It Works

### Phase 1: Offline Data Ingestion (One-time)
- Fetches YouTube transcripts from a whitelist
- Falls back to sample data if YouTube API fails
- Cleans transcripts (removes timestamps, noise)
- Chunks text into 200-500 token segments
- Generates embeddings using local SentenceTransformers
- Stores embeddings in FAISS index

### Phase 2: Real-time Inference
1. User asks a question in the React UI
2. Backend generates embedding for the question (LOCAL - no API call)
3. Retrieves top 2-3 most relevant chunks from FAISS (LOCAL - no API call)
4. Sends chunks + question to Groq API (ONE API call)
5. Converts Groq response to audio using Google TTS
6. Returns base64 audio to frontend
7. Frontend plays audio automatically
8. Text response logged to browser console only

## API Endpoints

### POST `/api/ask`
Request:
```json
{
  "question": "What are neural networks?"
}
```

Response:
```json
{
  "text": "Neural networks are...",
  "audio": "base64_encoded_mp3_data"
}
```

### GET `/health`
Health check endpoint that returns:
```json
{
  "status": "ok",
  "rag_ready": true
}
```

## Environment Variables

Create `.env` in `backend/` folder:

```
GROQ_API_KEY=gsk_xxxxx  # https://console.groq.com
GOOGLE_TTS_API_KEY=AIzaxxxxx  # Optional if using service account
YOUTUBE_API_KEY=AIzaxxxxx  # Required for fetching new transcripts
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json  # Optional
```

## Architecture

```
backend/
├── app/
│   ├── main.py (FastAPI app with CORS)
│   ├── api/
│   │   └── ask.py (RAG endpoint)
│   ├── rag/
│   │   ├── retriever.py (FAISS retrieval)
│   │   └── embedder.py (Local embeddings)
│   ├── llm/
│   │   └── groq_client.py (Groq API calls)
│   ├── speech/
│   │   └── google_tts.py (Text-to-speech)
│   ├── ingest/
│   │   └── youtube_transcript.py (Data pipeline)
│   ├── config/
│   │   └── settings.py (Configuration)
│   └── data/
│       └── vector_store/ (FAISS index + chunks)
└── .env

frontend/frontend/
├── src/
│   ├── App.js (Main React component)
│   ├── App.css (Styling)
│   ├── api/
│   │   └── askQuestion.js (Backend API calls)
│   └── index.js
└── package.json
```

## Key Features

✅ **FREE-TIER OPTIMIZED**
- Uses free Groq API (no prompt engineering APIs)
- Local embeddings (no embedding API calls)
- Local vector storage (FAISS)
- One Groq call per question max

✅ **OFFLINE PROCESSING**
- All heavy lifting happens offline during ingestion
- Realtime inference only needs one API call

✅ **RAG-BASED**
- Truly retrieval-augmented generation
- Grounds answers in lecture transcripts
- Teaching-style explanations

✅ **AUDIO-FIRST OUTPUT**
- Primary output is speech
- Text logged to console for debugging
- No visual AI response in UI

## Troubleshooting

### Backend won't start
```bash
# Make sure you're in the backend directory
cd backend

# Check Python version (3.8+)
python --version

# Reinstall dependencies
pip install -r requirements.txt --upgrade
```

### Frontend won't connect to backend
- Check that backend is running on http://localhost:8000
- Check browser console for CORS errors
- Verify `.env` has correct API keys

### No audio output
- Check that Google TTS API key is valid
- Check browser console for errors
- Verify audio player is not muted

### Data ingestion failed
- The system falls back to sample data automatically
- To use real YouTube transcripts, provide valid YOUTUBE_API_KEY
- Sample data covers: Neural Networks, PCA, Machine Learning

## Testing

### Test the backend API
```bash
curl -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is machine learning?"}'
```

### Test health endpoint
```bash
curl http://localhost:8000/health
```

## Deployment

For production deployment, refer to:
- **Backend**: FastAPI deployment guides (Heroku, Railway, AWS)
- **Frontend**: React build and deployment (Vercel, Netlify)
- Use environment variables for secrets (never commit .env)

## Cost Optimization

- **Groq API**: Free tier with rate limits. One call per question = minimal costs
- **Google TTS**: Free tier up to 1 million characters/month
- **No embedding API calls**: All local with SentenceTransformers
- **No vector DB costs**: FAISS is local and free

## License & Attribution

- Groq API: https://console.groq.com
- SentenceTransformers: https://www.sbert.net/
- FAISS: https://github.com/facebookresearch/faiss
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/
