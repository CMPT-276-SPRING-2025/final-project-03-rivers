import './LoginPage.css';
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import question from "../../assets/question.png";
import logo from '../../assets/logo.png';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth';
import {auth} from '../Firebase.jsx';
import Login from '../Music.jsx';



const LoginPage = () => {
  
  
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const login = async (e) => {
    e.preventDefault();
    try{
      await signInWithEmailAndPassword(
      auth, 
      loginEmail, 
      loginPassword);
  
    console.log("User logged in: ", auth.currentUser);
    navigate('/loading');
    setTimeout(() => {
          navigate('/home'); // After 5 seconds, navigate to home page
        }, 1000);
    } catch (error) {
      console.log(error.message);
    }
  };

  // const handleLogin = (e) => {
  //   e.preventDefault(); // Prevent form submission, so login action is handled by React

  //   navigate('/loading'); // Navigate to loading page

  //   setTimeout(() => {
  //     navigate('/home'); // After 5 seconds, navigate to home page
  //   }, 1000);
  // };

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
              <form onSubmit={login} data-testid="login-form">
                <h1 data-testid="login-header">Log In To Your Account</h1>

                <div className="input-group">
                    <input type="text" placeholder="Email" onChange={(e)=> { setLoginEmail(e.target.value)}} className="input" />
                    <input type="password" placeholder="Password" onChange={(e)=> { setLoginPassword(e.target.value)}} className="input" />
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
                  <button className="btn" data-testid="login-button" >Login</button>
                </div>
                <div style={{marginTop: "10px"}}>
                <button className="btn bg-white text-black border-[#e5e5e5]">
                  
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Login with Google
                </button>
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
                 
            {/* <h4>User Logged In: {user.email}</h4> */}
          
            </section>
        </div>
      
    </div>
  );
};

export default LoginPage;
