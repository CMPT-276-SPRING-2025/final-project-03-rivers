import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './SignupPage.css';
import question from '../../assets/question.png';
import Email from '../../assets/Email.png';
import Lock from '../../assets/Lock.png';
import User from '../../assets/User.png';
import { createUserWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';
import { auth } from '../Firebase.jsx';

const Signup = () => {
  const navigate = useNavigate();
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
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
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleSignup = async(e) => {
    e.preventDefault();
    // navigate('/loading');
    setError("");

    if (!isValidEmail(registerEmail)) {
      alert("Invalid email format. Please enter a valid email.");
      return;
    }

    setLoading(true);

        try {
          await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
          console.log("User logged in: ", auth.currentUser);
          setTimeout(() => {
            navigate('/home'); // Redirect after a short delay
          }, 1000);
        } catch (error) {
          
          setError("Failed to log in. Please check your credentials.");
          console.error(error.message);
          
        } finally {
          setLoading(false);
        }
    // setTimeout(() => {
    //   navigate('/home');
    // }, 1000);
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
          <h1 data-testid="welcome-header">Welcome To Focus Forge!</h1>
          <h3 data-testid="greeting-text">The Solution To Procrastination</h3>
          <div className="signUpButton" data-testid="login-section">
            <h2 data-testid="have-account-text">Already Have<br></br>An Account?</h2>
            <button className="btnToLogin" data-testid="login-button" onClick={handleLogin}>Log In</button>
          </div>
        </div>
        {/* Right Side (Signup Section) */}
        <form onSubmit={handleSignup}>
        <div className="right-signup" data-testid="right-signup">
          <h1 className="gradient-text" data-testid="signup-header">Create Account</h1>
          <div className="signupForm" data-testid="signup-form">
            <input type="text" placeholder="Name" className="input" data-testid="name-input" />
            <input type="email" placeholder="Email"value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className="input" data-testid="email-input" required/>
            <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Password" className="input" data-testid="password-input" />
            <div className="btnToSignup" data-testid="signup-button-container">
              <button className="btnToSignup" disabled = {loading} data-testid="signup-button">
              {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
            {error && <p className="error-text">{error}</p>}

          </div>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
