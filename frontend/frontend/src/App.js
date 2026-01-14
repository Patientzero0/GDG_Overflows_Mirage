import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { askQuestion } from './api/askQuestion';

function App() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await askQuestion(question);
      
      // Log the text response to console only
      if (response.text) {
        console.log('AI Response:', response.text);
      }

      // Play audio if available
      if (response.audio && response.audio.trim()) {
        const audioBlob = base64ToBlob(response.audio, 'audio/mpeg');
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      } else {
        console.log('No audio available. Check console for text response.');
      }

      // Clear input after successful request
      setQuestion('');
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const base64ToBlob = (base64, type) => {
    const bstr = atob(base64);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type });
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Teacher RAG</h1>
        <p className="subtitle">Ask any question about the lecture materials</p>
        
        <form onSubmit={handleSubmit} className="question-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question..."
            disabled={loading}
            className="input-field"
          />
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Processing...' : 'Ask'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        
        <audio ref={audioRef} controls className="audio-player" />
      </div>
    </div>
  );
}

export default App;
