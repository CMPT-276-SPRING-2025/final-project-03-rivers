import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './SignupPage.css';

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
      {/*Testing*/}
      <h1>Hello World</h1>
      <img src = {logo} alt="logo" className="logo" />
    </div>
  );
}

export default Signup;
