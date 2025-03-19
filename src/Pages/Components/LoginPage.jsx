import './LoginPage.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import question from "../../assets/question.png";


const LoginPage = () => {
  const navigate = useNavigate();
 
  const handleLogin = () => {
    navigate('/loading');

    setTimeout(() => {
      navigate('/home'); 
    }, 5000);
  };

  const handleSignUp = () => {
    navigate('/signup');
  }; 

  return (
    <div className="login-container">
      <section className="nav-bar">
        <div className="left-nav">
          <a>Logo</a>
          <a>Focus Forge</a>
        </div>
        <div className ="right-nav">
          <img src={question} alt="question icon about project" className="question" />
        </div>
      </section>

      <section className="login">
        <form action="login.php" method="post">
          <h1>Log In To Your Account</h1>
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            name="username" 
            id="username" 
            required 
          />
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            required 
          />
          <button type="submit" onClick={handleLogin}>Login</button>
          <button type="signup" onClick={handleSignUp}> Sign Up</button>
        </form>
      </section>

      <section className="about">
        {/* pop up when hover on the question mark */}
        <p>This is a webapp designed to help students and people with time-management issues manage their time while leaving space for free time.
        This project aims to help split lives up into manageable chunks and get through the day.</p>
      </section>

      <section className="signup">
        <h1>Welcome Back!</h1>
        <p>Ready to focus?</p>
        <p>Don't have an account?</p>
      </section>
    </div>
  )
}

export default LoginPage