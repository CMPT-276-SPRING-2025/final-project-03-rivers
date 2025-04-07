import React, { useState } from "react";
import "./AuthCallBack.css";
import question from "../../assets/question.png";
import logo from "../../assets/logo.png";

const AuthCallback = () => {
  const [loading] = useState(false);

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
              <button className="start-button" disabled>
                Back From Authentication
              </button>
              <div className="inline-question">
                <img src={question} alt="question icon" className="question" />
                <div className="popup inline-popup">
                  This is just a temporary callback page. No redirection occurs here.
                </div>
              </div>
            </div>
          </div>
          <h4>This is the callback screen after Todoist authentication.</h4>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;

