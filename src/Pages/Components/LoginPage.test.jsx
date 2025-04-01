import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './LoginPage';
import '@testing-library/jest-dom/vitest';

describe('LoginPage Component', () => {
  it('renders without crashing', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    expect(screen.getByTestId('focus-forge')).toBeInTheDocument();
    expect(screen.getByText('FocusForge')).toBeInTheDocument();
  });

  it('displays log-in part', () => {

    expect(screen.getByTestId('login-header')).toBeInTheDocument();
    expect(screen.getByText('Log In To Your Account')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('displays sign-up part', () => {

    expect(screen.getByTestId('signup-button')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByTestId('welcome-back-header')).toBeInTheDocument();
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByTestId('ready-to-focus-text')).toBeInTheDocument();
    expect(screen.getByText('Ready to focus?')).toBeInTheDocument();
    expect(screen.getByTestId('no-account-text')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  // it('handles login button click', () => {
  //   const loginButton = screen.getByTestId('login-button');
  //   fireEvent.click(loginButton);

  //   expect(window.location.pathname).toBe('/loading'); 
  // });

  // it('handles signup button click', () => {
  //   const signupButton = screen.getByTestId('signup-button');
  //   fireEvent.click(signupButton);

  //   expect(window.location.pathname).toBe('/signup'); 
  // });

});
