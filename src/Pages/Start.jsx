import React, { useState } from "react";
import "./start.css";
import { useNavigate } from "react-router-dom";
import question from "../assets/question.png";
import logo from "../assets/logo.png";

const Start = () => {
  const [loading, setLoading] = useState(false); // <-- Add this
  const [step, setStep] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleContinue = () => {
    setHasInteracted(true);
    setStep(1);
  };

  const handleTodoist = () => {
    setLoading(true); // <-- Set loading to true right before redirect

    const clientid = import.meta.env.VITE_TODOIST_CLIENT_ID;
    const redirect_uri = import.meta.env.VITE_TODOIST_REDIRECT_URI;
    const state = Math.random().toString(36).substring(2, 15);
    const scope = encodeURIComponent("data:read_write");

    const authURL = `https://todoist.com/oauth/authorize?client_id=${clientid}&scope=${scope}&state=${state}&redirect_uri=${redirect_uri}&response_type=code&force_confirm=true`;

    console.log("Auth URL:", authURL);

    setTimeout(() => {
      window.location.href = authURL;
    }, 800); // Optional small delay so "Redirecting..." is visible
  };

  return (
    <div className="start-page">
      {/* Top Nav */}
      <div className="top-nav-bar" data-testid="nav-bar">
        <div className="left-nav" data-testid="left-nav">
          <img src={logo} alt="logo" className="logo" data-testid="logo" />
          <h1 className="gradient-text" data-testid="focus-forge">FocusForge</h1>
        </div>
        <div className="right-nav" data-testid="right-nav">
          <img src={question} alt="question icon" className="question" data-testid="question-icon" />
          <div className="popup" data-testid="about-text">
            This app helps you manage your day by connecting tasks and time blocks with Todoist.
          </div>
        </div>
      </div>

      {/* Main Overlay */}
      <div className="overlay">
        <div className="overlay-content">
          <h1 className="gradient-text">Welcome to FocusForge</h1>
          <div className="connect-section">
            <div className="button-with-icon">
              <button className="start-button" onClick={handleTodoist} disabled={loading}>
                {loading ? "Redirecting..." : "Connect to Todoist →"}
              </button>
              <div className="inline-question">
                <img src={question} alt="question icon" className="question" />
                <div className="popup inline-popup">
                  Connecting to Todoist lets us access your tasks to help organize your day.
                </div>
              </div>
            </div>
          </div>
          <h4>Connect to Todoist and you'll be redirected back here, then into the app.</h4>
        </div>
      </div>
    </div>
  );
};

export default Start;
