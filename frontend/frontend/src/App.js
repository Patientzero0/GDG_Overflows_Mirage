import React, { useState, useEffect, useRef } from 'react';
import './App.css'; 
import { askQuestion } from './api/askQuestion';

function App() {
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]); // { type: 'user' | 'ai', text: string, audio?: string, sentiment?: string }
  const chatWindowRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom of chat window
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const playAudio = async (base64Audio) => {
    if (!base64Audio) {
      console.warn("No audio data to play.");
      return;
    }
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(
        Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer
      );
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (err) {
      console.error("Error playing audio:", err);
      setError("Failed to play audio.");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    const userMessage = { type: 'user', text: inputQuestion };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputQuestion('');
    setLoading(true);
    setError('');

    try {
      const response = await askQuestion(userMessage.text);
      
      const aiMessage = { 
        type: 'ai', 
        text: response.text, 
        audio: response.audio, 
        sentiment: response.sentiment, // Categorical
        sentiment_score: response.sentiment_score // Numerical
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      
      if (response.audio) {
        await playAudio(response.audio);
      }

      // Log sentiment to console as requested
      console.log("AI Response Sentiment:", response.sentiment, "(Score:", response.sentiment_score + ")");

    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error:', err);
      setMessages((prevMessages) => [...prevMessages, { type: 'ai', text: `Error: ${err.message}`, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Teacher RAG Chatbot</h1>
      </header>

      <main className="App-main">
        <section className="chat-section">
          <div className="chat-window" ref={chatWindowRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <span className="message-bubble">
                  {msg.text}
                </span>
                {msg.type === 'ai' && msg.sentiment && (
                  <span className={`sentiment ${msg.sentiment.toLowerCase()}`}>
                    ({msg.sentiment} {msg.sentiment_score ? `Score: ${msg.sentiment_score.toFixed(2)}` : ''})
                  </span>
                )}
                {msg.type === 'ai' && msg.recommendation && ( // NEW: Display recommendation
                  <div className="recommendation">
                    <strong>Next Step:</strong> {msg.recommendation}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="message ai">
                <span className="message-bubble loading">
                  Thinking...
                </span>
              </div>
            )}
            {error && <div className="error-message">Error: {error}</div>}
          </div>

          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask your question..."
              disabled={loading}
              className="message-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="send-button"
            >
              {loading ? 'Sending...' : 'Ask'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
