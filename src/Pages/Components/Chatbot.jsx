import React, { useState, useRef, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { generateContent } from './Model';
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [aiPersonality, setAiPersonality] = useState('');
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPersonalityModalOpen, setIsPersonalityModalOpen] = useState(false);
  const personalityInputRef = useRef(null);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleAiPersonalityInput = (e) => {
    setAiPersonality(e.target.value);
    if (personalityInputRef.current) {
      personalityInputRef.current.style.height = 'auto';
      personalityInputRef.current.style.height = `${personalityInputRef.current.scrollHeight}px`;
    }
  };

  const handleClear = () => {
    setUserInput('');
    setAiPersonality('');
    setResponse([]);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setResponse([...response, {
        type: "system",
        message: "Please enter a prompt.."
      }]);
      return;
    }
    setIsLoading(true);
    try {
      const prompt = aiPersonality ? `Act like ${aiPersonality}. ${userInput}` : userInput;
      const res = await generateContent(prompt);
      setResponse([
        ...response,
        { type: "user", message: userInput },
        { type: "bot", message: res() },
      ]);
      setUserInput('');
    } catch (err) {
      console.error("Error generating response:", err);
      setResponse([...response, {
        type: "system",
        message: "Failed to generate response"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed right-30 top-4 z-50 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-transform duration-200 ${
          isExpanded ? 'visibility: hidden' : ''
        }`}
        aria-label="Toggle chat"
      >
        <IoIosSend className="h-5 w-5" />
      </button>

      {/* Sidebar Container */}
      <div
        className={`
          fixed right-0 top-0 h-screen bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isExpanded ? 'translate-x-0' : 'translate-x-full'}
          z-40
        `}
      >
        {/* Chat Content */}
        <div className="flex flex-col h-full w-[350px]">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
                isExpanded ? 'rotate-180' : ''
              }`}
              aria-label="Toggle chat"
            >
              <IoIosSend className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPersonalityModalOpen(true)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Personality
              </button>
              <button
                onClick={handleClear}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            {response.length === 0 ? (
              <div className="text-center text-gray-500">Got Questions? Chatty's Got Answers.</div>
            ) : (
              response.map((msg, index) => (
                msg.type === "user" ? (
                  <div key={index} className="mb-4 flex justify-end">
                    <div className="chat-bubble bg-blue-500 text-black max-w-[70%] break-words">
                      {msg.message}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="mb-4 flex justify-start">
                    <div className="chat-bubble bg-black max-w-[70%] break-words">
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    </div>
                  </div>
                )
              ))
            )}
            {isLoading && <p className="text-center text-gray-500">Generating response...</p>}
          </div>

          {/* Input Section */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={handleUserInput}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 p-2 border rounded text-gray-500"
              />
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                <IoIosSend className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Modal */}
      <dialog
        open={isPersonalityModalOpen}
        onClose={() => setIsPersonalityModalOpen(false)}
        className="modal"
      >
        <div className="modal-content bg-blue-700 rounded">
          <div className="modal-header">
            <h2 className="modal-title">Set AI Personality</h2>
            <button
              onClick={() => setIsPersonalityModalOpen(false)}
              className="modal-close-btn"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            <textarea
              value={aiPersonality}
              onChange={handleAiPersonalityInput}
              ref={personalityInputRef}
              placeholder="Enter AI personality..."
              className="w-full p-2 border rounded text-black bg-blue-50 resize-vertical"
              style={{ 
                minHeight: '40px',
                maxHeight: '80vh',
                width: '30vw',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div className="modal-footer">
            <button
              onClick={() => setIsPersonalityModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsPersonalityModalOpen(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}