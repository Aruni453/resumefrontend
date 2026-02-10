import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AIAssistant.css';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm ResumeBuilder AI, your personal assistant for creating amazing resumes. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = inputMessage.trim();
    if (message) {
      sendMessage(message);
      setInputMessage('');
    }
  };

  const handleQuickAction = (action) => {
    const messages = {
      'resume-tips': 'Can you give me some tips for writing a great resume?',
      'cover-letter': 'How do I write an effective cover letter?',
      'interview-prep': 'What are some common interview questions and how should I prepare?',
      'job-search': 'What are the best strategies for finding job opportunities?'
    };
    sendMessage(messages[action]);
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>ResumeBuilder AI Assistant</h1>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}-message`}>
              <div className="message-content">
                <p>{message.content}</p>
                <span className="timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message ai-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="quick-actions">
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction('resume-tips')}
            disabled={isLoading}
          >
            Resume Tips
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction('cover-letter')}
            disabled={isLoading}
          >
            Cover Letter Help
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction('interview-prep')}
            disabled={isLoading}
          >
            Interview Prep
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction('job-search')}
            disabled={isLoading}
          >
            Job Search Tips
          </button>
        </div>

        <form className="message-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="message-input"
            placeholder="Ask me anything about resumes, career advice, or job searching..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!inputMessage.trim() || isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
