import React from "react";
import "./start.css";
import question from "../assets/question.png";
import logo from "../assets/logo.png";

const Start = () => {
  const generateState = () => Math.random().toString(36).substring(2, 15);

  const handleTodoist = () => {
    const clientid = import.meta.env.VITE_TODOIST_CLIENT_ID;
    const redirect_uri = import.meta.env.VITE_TODOIST_REDIRECT_URI;
    const state = generateState();

    const authURL = `https://todoist.com/oauth/authorize?client_id=${clientid}&scope=data:read_write&state=${state}&redirect_uri=${redirect_uri}&response_type=code&force_confirm=true`;

    window.location.href = authURL;
  };

  return (
    <div className="start-page">
      <div className="top-nav-bar" data-testid="nav-bar">
        <div className="left-nav" data-testid="left-nav">
          <img src={logo} alt="logo" className="logo" data-testid="logo" />
          <h1 className="gradient-text" data-testid="focus-forge">FocusForge</h1>
        </div>
        <div className="right-nav" data-testid="right-nav">
          <img src={question} alt="question icon about project" className="question" data-testid="question-icon" />
          <div className="popup" data-testid="about-text">
            This is a webapp designed to help students and people with time-management issues manage their time while leaving space for free time.
            This project aims to help split lives up into manageable chunks and get through the day.
          </div>
        </div>
      </div>

      <div className="overlay">
        <div className="overlay-content">
          <div className="logo-container">
            <h1 className="gradient-text">Welcome to FocusForge</h1>

            <div className="connect-section">
              <div className="button-with-icon">
                <button className="start-button" onClick={handleTodoist}>
                  Connect to Todoist →
                </button>
                <div className="inline-question">
                  <img src={question} alt="question icon about todoist" className="question" />
                  <div className="popup inline-popup">
                    Connecting to Todoist lets us access your tasks and projects so we can help you organize your day effectively.
                  </div>
                </div>
              </div>
            </div>

            <h4>Connect To Todoist And You Will Be Redirected To Our Application</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
