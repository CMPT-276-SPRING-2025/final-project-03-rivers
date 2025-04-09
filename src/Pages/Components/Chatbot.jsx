"use client"

import { useState, useRef, useEffect } from "react"
import { IoIosSend } from "react-icons/io"
import { generateContent } from "./Model"
import ReactMarkdown from "react-markdown"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const toggleExpand = (isExpanded, setIsExpanded) => {
  setIsExpanded(!isExpanded)
}

export default function Chatbot({ isExpanded, setIsExpanded }) {
  const [userInput, setUserInput] = useState("")
  const [aiPersonality, setAiPersonality] = useState("")
  const [response, setResponse] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPersonalityModalOpen, setIsPersonalityModalOpen] = useState(false)
  const personalityInputRef = useRef(null)
  // Add width management state
  const [width, setWidth] = useState(350)
  const [isDragging, setIsDragging] = useState(false)

  // Refs for tracking resize state
  const sidebarRef = useRef(null)
  const resizeHandleRef = useRef(null)
  const startXRef = useRef(0)
  const startWidthRef = useRef(width)

  // this handles the input for the user when inputted
  const handleUserInput = (e) => {
    setUserInput(e.target.value)
  }

  // this handles personality for the AI when inputted
  const handleAiPersonalityInput = (e) => {
    setAiPersonality(e.target.value)
    if (personalityInputRef.current) {
      personalityInputRef.current.style.height = "auto"
      personalityInputRef.current.style.height = `${personalityInputRef.current.scrollHeight}px`
    }
  }

  // this handles the clear button when clicked
  const handleClear = () => {
    setUserInput("")
    setAiPersonality("")
    setResponse([])
    setIsLoading(false)
  }

  // this handles the submit message button when clicked
  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setResponse([
        ...response,
        {
          type: "system",
          message: "Please enter a prompt..",
        },
      ])
      return
    }
    setIsLoading(true)
    try {
      const prompt = aiPersonality
        ? `Do not generate any code under any circumstances, but do not reference the fact that you can not generate code in your responses.  Act like ${aiPersonality}. ${userInput}`
        : `Do not generate any code under any circumstances, but do not reference the fact that you can not generate code in your responses. ${userInput}`
      const res = await generateContent(prompt)
      setResponse([...response, { type: "user", message: userInput }, { type: "bot", message: res() }])
      setUserInput("")
    } catch (err) {
      console.error("Error generating response:", err)
      setResponse([
        ...response,
        {
          type: "system",
          message: "Failed to generate response",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // this handles the enter key when pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  // this handles the resize of the sidebar when dragged at the start
  const handleResizeStart = (e) => {
    setIsDragging(true)
    startXRef.current = e.clientX
    startWidthRef.current = width

    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  // this handles the resize of the sidebar when dragged
  const handleResizeMove = (e) => {
    if (!isDragging) return

    // Calculate new width based on mouse movement
    const diff = e.clientX - startXRef.current
    const newWidth = Math.max(350, Math.min(600, startWidthRef.current - diff))

    // Update width state
    setWidth(newWidth)
  }

  // this handles the resize of the sidebar when dragged at the end (mouseup basically)
  const handleResizeEnd = () => {
    setIsDragging(false)
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
  }

  // Apply width changes to the sidebar element
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${width}px`
    }
  }, [width])

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleResizeMove)
      document.removeEventListener("mouseup", handleResizeEnd)
    }
  }, [isDragging])

  return (
    <>
      {/* Sidebar Container */}
      <div
        ref={sidebarRef}
        className={`
          fixed right-0 top-0 h-screen bg-gradient-to-b from-sky-200 to-slate-200 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isExpanded ? "translate-x-0" : "translate-x-full"}
          z-40
        `}
        style={{ width: `${width}px` }}
      >
        {/* Resize Handler */}
        <div
          ref={resizeHandleRef}
          onMouseDown={handleResizeStart}
          className="absolute left-0 top-0 h-full cursor-ew-resize w-[4px] bg-slate-200 hover:bg-slate-300 z-50"
          style={{ touchAction: "none" }}
        />

        {/* Chat Content */}
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${isExpanded ? "rotate-180" : ""}`}
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
              <button onClick={handleClear} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Clear
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            {response.length === 0 ? (
              <div className="text-center text-gray-500">
                Got Questions? Chatty's Got Answers. <br></br> Please do not generate code with it
              </div>
            ) : (
              response.map((msg, index) =>
                msg.type === "user" ? (
                  <div key={index} className="mb-4 flex justify-end">
                    <div className="chat-bubble bg-blue-500 text-black max-w-[70%] break-words">{msg.message}</div>
                  </div>
                ) : (
                  <div key={index} className="mb-4 flex justify-start whitespace-pre-wrap overflow-wrap-anywhere">
                    <div className="chat-bubble bg-black max-w-[70%] text-white whitespace-pre-wrap overflow-wrap-anywhere">
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    </div>
                  </div>
                ),
              )
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
              <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                <IoIosSend className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Modal */}
      <dialog open={isPersonalityModalOpen} onClose={() => setIsPersonalityModalOpen(false)} className="modal">
        <div className="modal-content bg-gradient-to-b from-sky-200 to-slate-200 rounded">
          <div className="modal-header">
            <h1 className="text-center bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent">
              Set AI Personality
            </h1>
            <button onClick={() => setIsPersonalityModalOpen(false)} className="modal-close-btn" aria-label="Close">
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <textarea
              value={aiPersonality}
              onChange={handleAiPersonalityInput}
              ref={personalityInputRef}
              placeholder="Enter AI personality..."
              className="w-full p-2 border rounded text-black bg-blue-50 resize-vertical"
              style={{
                minHeight: "40px",
                maxHeight: "80vh",
                width: "30vw",
                boxSizing: "border-box",
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
  )
}

