import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './LoginPage';
import "@testing-library/jest-dom/vitest";



describe('LoginPage Component', () => {
    it('renders without crashing', () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );

        expect(screen.getByTestId('focus-forge')).toBeInTheDocument();
        expect(screen.getByText('Focus Forge')).toBeInTheDocument();
        expect(screen.getByTestId('logo')).toBeInTheDocument();
        expect(screen.getByText('Logo')).toBeInTheDocument();
  });

    it('displays log in part', () => {
        expect(screen.getByTestId('login-header')).toBeInTheDocument();
        expect(screen.getByText('Log In To Your Account')).toBeInTheDocument
        expect(screen.getByTestId('username-label')).toBeInTheDocument();
        expect(screen.getByText('Username:')).toBeInTheDocument();
        expect(screen.getByTestId('password-label')).toBeInTheDocument();
        expect(screen.getByText('Password:')).toBeInTheDocument();
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
  });

    it ('displays sign up part', () => {
        expect(screen.getByTestId('signup-button')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByTestId('welcome-back-header')).toBeInTheDocument();
        expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
        expect(screen.getByTestId('ready-to-focus-text')).toBeInTheDocument();
        expect(screen.getByText('Ready to focus?')).toBeInTheDocument();
        expect(screen.getByTestId('no-account-text')).toBeInTheDocument();
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });
});
