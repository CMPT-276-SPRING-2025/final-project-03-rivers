import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    </div>
  );
}

export default Signup;
