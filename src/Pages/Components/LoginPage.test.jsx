import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  
  return {
    ...actual,
    useNavigate: vi.fn(),
    MemoryRouter: actual.MemoryRouter,
  };
});

describe('LoginPage', () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  };

  it('should render login page', () => {
    setup();
    const loginPage = screen.getByTestId('login-container');
    expect(loginPage).toBeInTheDocument();
  });

  it('should render login form with username and password fields', () => {
    setup();

    const usernameLabel = screen.getByTestId('username-label');
    expect(usernameLabel).toBeInTheDocument();
    expect(usernameLabel).toHaveTextContent('Username:');

    const usernameInput = screen.getByTestId('username-input');
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute('type', 'text');

    const passwordLabel = screen.getByTestId('password-label');
    expect(passwordLabel).toBeInTheDocument();
    expect(passwordLabel).toHaveTextContent('Password:');

    const passwordInput = screen.getByTestId('password-input');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should navigate to /loading when login button is clicked', () => {
    const navigateMock = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
    
    setup();

    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    expect(navigateMock).toHaveBeenCalledWith('/loading');

    return new Promise(resolve => {
      setTimeout(() => {
        expect(navigateMock).toHaveBeenCalledWith('/home');
        resolve();
      }, 5000);
    });
  });

  it('should render signup button', () => {
    setup();
    const signupButton = screen.getByTestId('signup-button');
    expect(signupButton).toBeInTheDocument();
    expect(signupButton).toHaveTextContent('Sign Up');
  });

  it('should handle form submission', () => {
    setup();

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    fireEvent.click(loginButton);
  });

  it('should show hover text on question mark', () => {
    setup();
    const questionIcon = screen.getByTestId('question-icon');
    fireEvent.mouseOver(questionIcon);

    const hoverText = screen.getByTestId('about-text'); 
    expect(hoverText).toBeInTheDocument();
    expect(hoverText).toHaveTextContent(
      'This is a webapp designed to help students and people with time-management issues manage their time while leaving space for free time. This project aims to help split lives up into manageable chunks and get through the day.'
    );
  });
});