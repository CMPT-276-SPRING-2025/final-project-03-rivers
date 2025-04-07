import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthCallBack.css";
import question from "../../assets/question.png";
import logo from "../../assets/logo.png";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Authenticating...");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const error = query.get("error");

    if (error) {
      setMessage("Authorization denied");
      return;
    }

    if (code) {
      axios
        .post("http://localhost:4000/auth/token", { code })
        .then((res) => {
          localStorage.setItem("access_token", res.data.access_token);
          setMessage("Authentication successful! Redirecting...");
          setTimeout(() => {
            navigate("/home", { replace: true });
          }, 2000);
        })
        .catch((err) => {
          console.error(err);
          setMessage("Authentication failed");
        });
    }
  }, [location, navigate]);

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
                {message}
              </button>
              <div className="inline-question">
                <img src={question} alt="question icon" className="question" />
                <div className="popup inline-popup">
                  Connecting to Todoist lets us access your tasks to help organize your day.
                </div>
              </div>
            </div>
          </div>
          <h4>{message}</h4>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
