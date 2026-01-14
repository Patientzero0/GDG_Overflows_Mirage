# Teacher RAG - QUICK START

## ✅ SYSTEM IS NOW RUNNING!

### Current Status:
- ✅ Backend API: http://localhost:8000
- ✅ Frontend UI: http://localhost:3000
- ✅ FAISS Vector Store: Built and ready
- ✅ Embeddings: Loaded (all-MiniLM-L6-v2)

### How to Use:

1. **Open the UI**: http://localhost:3000
2. **Ask a question**: Type any question about:
   - Neural Networks
   - Principal Component Analysis (PCA)
   - Machine Learning basics
3. **Listen to response**: Audio plays automatically
4. **Check console**: Browser console (F12) shows the AI text response

### Example Questions:
- "What are neural networks?"
- "Explain PCA in simple terms"
- "How does machine learning work?"
- "What is the difference between supervised and unsupervised learning?"

### Architecture Summary:

```
USER INPUT
    ↓
React Frontend (http://localhost:3000)
    ↓ (POST /api/ask)
FastAPI Backend (http://localhost:8000)
    ↓ (Question → Embedding)
SentenceTransformers [LOCAL - no API call]
    ↓
FAISS Vector Store [LOCAL - no API call]
    ↓ (Top 2-3 chunks)
Groq API [ONE API call per question]
    ↓
Google Text-to-Speech [ONE API call]
    ↓
Base64 Audio → Frontend
    ↓
🔊 Plays automatically
📝 Text logged to console
```

### API Call Count Per Question:
- Embedding generation: 0 (local)
- Vector retrieval: 0 (local FAISS)
- Groq LLM: 1 (required)
- Google TTS: 1 (required)
- **TOTAL: 2 API calls per question** ✅ MINIMAL!

### To Stop Servers:

**Terminal 1 (Backend)**: Press Ctrl+C
**Terminal 2 (Frontend)**: Press Ctrl+C

### To Restart:

Backend:
```bash
cd backend
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend/frontend
npm start
```

### Files Modified/Created:

✅ Created `app/__init__.py` (package marker)
✅ Created `app/data/sample_transcripts.json` (fallback data)
✅ Created all subpackage `__init__.py` files
✅ Updated `ingest_data.py` (fallback to sample data)
✅ Updated `frontend/src/App.js` (RAG UI)
✅ Updated `frontend/src/App.css` (styling)
✅ Fixed `youtube_transcript.py` (API compatibility)
✅ Updated `requirements.txt` (removed invalid `app` entry)
✅ Created `README.md` (full documentation)

### Next Steps (Optional):

1. **Add your own YouTube videos**: Edit `app/config/settings.py` YOUTUBE_VIDEO_IDS
2. **Customize system prompt**: Edit `app/llm/groq_client.py` prompt template
3. **Change embedding model**: Edit `app/config/settings.py` EMBEDDING_MODEL
4. **Deploy to cloud**: See README.md for deployment guides

### Support:

If something breaks:
1. Check browser console (F12) for errors
2. Check backend terminal for error messages
3. Verify .env file has valid API keys
4. Try restarting both servers

Enjoy your Teacher RAG! 🚀
