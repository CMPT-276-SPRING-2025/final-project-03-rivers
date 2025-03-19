import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './SignupPage.css';
import question from '../../assets/question.png';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/loading');

    setTimeout(() => {
      navigate('/home');
    }, 5000);
  };

  return (
    <div className="signup-container">
        <div className="top-nav-bar">
            <div className="left-nav">
                <img src = {logo} alt="logo" className="logo" />
                <h1>FocusForge</h1>
            </div>
            <div className="right-nav">
                <img src={question} alt="question icon about project" className="question" />
                <div className = "popup">
                    This is a webapp designed to help students and people with time-management issues manage their time while leaving space for free time.
                    This project aims to help split lives up into manageable chunks and get through the day.
                </div>
            </div>
        </div>
    </div>
  );
}

export default Signup;
