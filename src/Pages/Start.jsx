import React from "react";
import "./start.css";
import {useNavigate} from "react-router-dom";
import question from "../assets/question.png";
import logo from "../assets/logo.png";

const Start = () => {
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
        <div className="logo-container">
          <h1 className = "gradient-text">FocusForge</h1>
        </div>
        <h3>The Solution To Procrastination!</h3>
        <button className="start-button">Continue →</button>
      </div>
    </div>
  );
};

export default Start;
