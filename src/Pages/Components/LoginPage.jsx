import './LoginPage.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import question from "../../assets/question.png";
import logo from '../../assets/logo.png';
import { signInWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';
import { auth } from '../Firebase.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(loginEmail)) {
      alert("Invalid email format. Please enter a valid email.");
      return;
    }

    setLoading(true); // Start loading state

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log("User logged in: ", auth.currentUser);
  
        navigate('/home'); // Redirect after a short delay
 
    } catch (error) {
      
      setError("Failed to log in. Please check your credentials.");
      console.error(error.message);
      setLoading(false); // Stop loading if login fails
    }
  };
  console.log("LoginPage loaded");

  return (
    <div className="login-container" data-testid="login-container">
      {/* Navigation Bar */}
      <div className="nav-bar" data-testid="nav-bar">
        <div className="left-nav" data-testid="left-nav">
          <img src={logo} alt="logo" className="logo" data-testid="logo" />
          <h1 data-testid="focus-forge" className = "gradient-text">FocusForge</h1>
        </div>
        <div className="right-nav" data-testid="right-nav">
          <img src={question} alt="question icon" className="question" data-testid="question-icon" />
          <div className="popup" data-testid="about">
            <p data-testid="about-text">This web app helps students and professionals manage time efficiently.</p>
          </div>
        </div>
      </div>

      <div className="box" data-testid="box">
        {/* Login Form Section */}
        <section className="login" data-testid="login-section">
          <form onSubmit={handleLogin} data-testid="login-form">
            <h1 data-testid="login-header" className = "gradient-text">Log In To Your Account</h1>
            <div className="input-group">
              <input
                type="text"
                placeholder="Email"
                onChange={(e) => setLoginEmail(e.target.value)}
                className="input"
                required
                data-testid="email-input"
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setLoginPassword(e.target.value)}
                className="input"
                required
                data-testid="password-input"
              />
            </div>
            {error && <p className="error-message" data-testid="error-message">{error}</p>}
            <div className="login-button">
              <button className="btn" disabled={loading} data-testid="login-button">
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </section>

        {/* Sign-Up Information Section */}
        <section className="signup" data-testid="signup-section">
          <div className="greet" data-testid="greet">
            <h1 data-testid="welcome-back-header">Welcome Back!</h1>
            <h3 data-testid="ready-to-focus-text">Ready to focus?</h3>
          </div>
          <div className="signup-button" data-testid="signup-button">
            <h2 data-testid="no-account-text">Don't Have An<br></br>Account?</h2>
            <button className="btn btn-outline" onClick={() => navigate('/signup')} data-testid="signup-action-button">
              Sign Up
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
