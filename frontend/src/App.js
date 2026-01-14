import React, { useState } from 'react';
import './App.css';
import { askQuestion } from './api/askQuestion';
import { playAudio } from './audio/playAudio';

function App() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await askQuestion(question);
      console.log("AI Generated Text:", response.text); // Log to console
      await playAudio(response.audio);
    } catch (err) {
      setError(err.message || "Failed to get an answer. Please try again.");
      console.error("Error in App:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Teacher RAG Assistant</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the lecture..."
            rows="4"
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </header>
    </div>
  );
}

export default App;
