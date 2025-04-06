import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./start.css";
import { useNavigate } from "react-router-dom";
import question from "../assets/question.png";
import logo from "../assets/logo.png";

const Start = () => {
  const [step, setStep] = useState(0); // 0: welcome, 1: connect to todoist
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleContinue = () => {
    setHasInteracted(true);
    setStep(1);
  };

  const swipeVariants = {
    initial: { x: hasInteracted ? 300 : 0, opacity: hasInteracted ? 0 : 1 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: -300, opacity: 0, transition: { duration: 0.5 } },
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
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="welcome"
                variants={swipeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="logo-container"
              >
                <h1 className="gradient-text">FocusForge</h1>
                <h3>The Solution To Procrastination!</h3>
                <button className="start-button" onClick={handleContinue}>
                  Continue →
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="todoist"
                variants={swipeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="logo-container"
              >
                <h1 className="gradient-text">Connect to Todoist</h1>
                <button className="start-button" onClick={handleContinue}>
                  Connect To Todoist →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Start;
