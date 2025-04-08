import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthCallback.css";
import question from "../../assets/question.png";
import logo from "../../assets/logo.png";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Authenticating...");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const error = query.get("error");
    const token = localStorage.getItem("access_token");

    if (token) {
      setMessage("Welcome back! Redirecting...");
      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 1500);
      return;
    }

    if (error) {
      setMessage("Authorization denied");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
      return;
    }

    if (code && !isProcessing) {
      setIsProcessing(true);
      const baseUrl = import.meta.env.VITE_APP_BASE_URL;
      const fullUrl = `${baseUrl}/api/auth-token`;

      axios
        .post(fullUrl, { code })
        .then((res) => {
          localStorage.setItem("access_token", res.data.access_token);
          setMessage("Authentication successful!");
          window.history.replaceState(null, "", window.location.pathname);
          setTimeout(() => {
            navigate("/home", { replace: true });
          }, 2000);
        })
        .catch((err) => {
          console.error("❌ Auth failed:", err);
          setMessage("Authentication failed. Please try again.");
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 6000);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    } else {
      setMessage("Invalid access. Redirecting...");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    }
  }, [location, navigate]);

  return (
    <div className="start-page">
      {/* Top Nav */}
      <div className="top-nav-bar">
        <div className="left-nav">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="gradient-text">FocusForge</h1>
        </div>
        <div className="right-nav">
          <img src={question} alt="question icon" className="question" />
          <div className="popup">
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
              <button className="start-button" disabled>{message}</button>
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