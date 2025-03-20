import './LoginPage.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import question from "../../assets/question.png";

const LoginPage = () => {
  const navigate = useNavigate();
 
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission, so login action is handled by React

    navigate('/loading');

    setTimeout(() => {
      navigate('/home'); 
    }, 5000);
  };

  const handleSignUp = () => {
    navigate('/signup');
  }; 

  return (
    <div className="login-container" data-testid="login-container">
      <section className="nav-bar" data-testid="nav-bar">
        <div className="left-nav" data-testid="left-nav">
          <a data-testid="logo">Logo</a>
          <a data-testid="focus-forge">Focus Forge</a>
        </div>
        <div className ="right-nav" data-testid="right-nav">
          <img src={question} alt="question icon about project" className="question" data-testid="question-icon" />
        </div>
      </section>

      <section className="about" data-testid="about">
        {/* pop up when hover on the question mark */}
        <p data-testid="about-text">
          This is a webapp designed to help students and people with time-management issues manage their time while leaving space for free time.
          This project aims to help split lives up into manageable chunks and get through the day.
        </p>
      </section>

      <section className="login" data-testid="login-section">
        <form action="login.php" method="post" data-testid="login-form">
          <h1 data-testid="login-header">Log In To Your Account</h1>
          <label htmlFor="username" data-testid="username-label">Username:</label>
          <input 
            type="text" 
            name="username" 
            id="username" 
            required 
            data-testid="username-input"
          />
          <label htmlFor="password" data-testid="password-label">Password:</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            required 
            data-testid="password-input"
          />
          <button type="submit" onClick={handleLogin} data-testid="login-button">Login</button>
          <button type="signup" data-testid="signup-button" onClick={handleSignUp}> Sign Up</button>
        </form>
      </section>

      <section className="signup" data-testid="signup-section">
        <h1 data-testid="welcome-back-header">Welcome Back!</h1>
        <p data-testid="ready-to-focus-text">Ready to focus?</p>
        <p data-testid="no-account-text">Don't have an account?</p>
      </section>
    </div>
  );
}

export default LoginPage;
