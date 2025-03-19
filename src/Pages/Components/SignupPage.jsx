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
    <div className="top-nav-bar">
        <div className="left-nav">
            <img src = {logo} alt="logo" className="logo" />
            <h1>FocusForge</h1>
        </div>
        <div className="right-nav">
            <img src={question} alt="question icon about project" className="question" />
        </div>
    </div>
  );
}

export default Signup;
