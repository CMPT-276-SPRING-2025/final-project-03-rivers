import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate();
 
  const handleLogin = () => {
    navigate('/home'); 
  };

  return (
    <div className="login-container">
      <section className="nav-bar">
        <div className="logo">
          <a>Logo</a>
          <a>Focus Forge</a>
          <a>about button here</a>
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