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
      setTimeout(() => {
        navigate('/home'); // Redirect after a short delay
      }, 1000);
    } catch (error) {
      
      setError("Failed to log in. Please check your credentials.");
      console.error(error.message);
      setLoading(false); // Stop loading if login fails
    }
  };

  return (
    <div className="login-container">
      {/* Navigation Bar */}
      <div className="nav-bar">
        <div className="left-nav">
          <img src={logo} alt="logo" className="logo" />
          <h1>FocusForge</h1>
        </div>
        <div className="right-nav">
          <img src={question} alt="question icon" className="question" />
          <div className="popup">
            <p>This web app helps students and professionals manage time efficiently.</p>
          </div>
        </div>
      </div>

      <div className="box">
        {/* Login Form Section */}
        <section className="login">
          <form onSubmit={handleLogin}>
            <h1>Log In To Your Account</h1>
            <div className="input-group">
              <input
                type="text"
                placeholder="Email"
                onChange={(e) => setLoginEmail(e.target.value)}
                className="input"
                required
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setLoginPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="login-button">
              <button className="btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </section>

        {/* Sign-Up Information Section */}
        <section className="signup">
          <div className="greet">
            <h1>Welcome Back!</h1>
            <p>Ready to focus?</p>
          </div>
          <div className="signup-button">
            <p>Don't have an account?</p>
            <button className="btn btn-outline" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
