import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './SignupPage.css';
import question from '../../assets/question.png';
import Email from '../../assets/Email.png';
import Lock from '../../assets/Lock.png';
import User from '../../assets/User.png';

const Signup = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/loading');

    setTimeout(() => {
      navigate('/home');
    }, 5000);
  };

  return (
    <div className="signup-container" data-testid="signup-container">
      {/* Top Navigation Bar */}
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
      {/* Signup UI */}
      <div className="signup-UI" data-testid="signup-ui">
        {/* Left Side (Login Section) */}
        <div className="left-signup" data-testid="left-signup">
          <h1 data-testid="welcome-back-header">Welcome Back!</h1>
          <h3 data-testid="ready-to-focus-text">Ready to focus?</h3>
          <div className="signUpButton" data-testid="login-section">
            <h2 data-testid="no-account-text">Don't have an account?</h2>
            <button className="btnToLogin" data-testid="login-button" onClick={handleLogin}>Log In</button>
          </div>
        </div>
        {/* Right Side (Signup Section) */}
        <div className="right-signup" data-testid="right-signup">
          <h1 className="gradient-text" data-testid="signup-header">Create Account</h1>
          <div className="signupForm" data-testid="signup-form">
            <input type="text" placeholder="Name" className="input" data-testid="name-input" />
            <input type="email" placeholder="Email" className="input" data-testid="email-input" />
            <input type="password" placeholder="Password" className="input" data-testid="password-input" />
            <div className="btnToSignup" data-testid="signup-button-container">
              <button className="btnToSignup" data-testid="signup-button" onClick={handleSignup}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
