import './LoginPage.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import question from "../../assets/question.png";
import logo from '../../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission, so login action is handled by React

    navigate('/loading'); // Navigate to loading page

    setTimeout(() => {
      navigate('/todolist'); // After 5 seconds, navigate to home page
    }, 5000);
  };

  const handleSignUp = () => {
    navigate('/signup'); // Navigate to signup page
  };

  return (
    <div className="login-container" data-testid="login-container">
      {/* Navigation Bar */}
      <div className="nav-bar" data-testid="nav-bar">
        
        <div className="left-nav" data-testid="left-nav">
          <img src={logo} alt="logo" className="logo" data-testid="logo"/>
          <h1 data-testid="focus-forge">FocusForge</h1>
        </div>

        <div className="right-nav" data-testid="right-nav">
          <img src={question} alt="question icon about project" className="question" data-testid="question-icon" />

          {/* Pop-Up / About Section */}
          <div className="popup" data-testid="about">
            {/* Pop-up when hover on the question mark */}
            <p data-testid="about-text">
              This is a webapp designed to help students and people with time-management issues manage their time while leaving space for free time.
              This project aims to help split lives up into manageable chunks and get through the day.
            </p>
          </div>

        </div>
      </div>

      <div className="box" data-testid="box"> 
        {/* Login Form Section */}
        <section className="login" data-testid="login-section">
              <form data-testid="login-form">
                <h1 data-testid="login-header">Log In To Your Account</h1>

                <div className="input-group">
                    <input type="text" placeholder="Email" className="input" />
                    <input type="password" placeholder="Password" className="input" />
                </div>
                
                {/*<label htmlFor="username" data-testid="username-label">Username:</label>
                <input 
                  type="text" 
                  name="username" 
                  id="username" 
                  required 
                  data-testid="username-input"
                />
                {/*<label htmlFor="password" data-testid="password-label">Password:</label>
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  required 
                  data-testid="password-input"
                />*/}

                <div className="login-button">
                  <button className="btn" data-testid="login-button" onClick={handleLogin}>Login</button>
                </div>

              </form>
            </section>

            {/* Sign-Up Information Section */}
            <section className="signup" data-testid="signup-section">
              
              <div className="greet">
                <h1 data-testid="welcome-back-header">Welcome Back!</h1>
                <p data-testid="ready-to-focus-text">Ready to focus?</p>
              </div>

              <div className="signup-button">
                <p data-testid="no-account-text">Don't have an account?</p>
                <button className="btn btn-outline" data-testid="signup-button" onClick={handleSignUp}>Sign Up</button>
              </div>

            </section>
        </div>
      
    </div>
  );
};

export default LoginPage;
