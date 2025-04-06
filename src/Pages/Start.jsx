import React from "react";
import "./start.css";
import {useNavigate} from "react-router-dom";

const Start = () => {
  return (
    <div className="start-page">
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
