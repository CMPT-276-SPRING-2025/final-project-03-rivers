import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import SignupPage from './SignupPage';
import '@testing-library/jest-dom/vitest';

describe('SignupPage Component', () => {
    it('renders without crashing', () => {
        render(
        <Router>
            <SignupPage />
        </Router>
        );
    
        expect(screen.getByTestId('focus-forge')).toBeInTheDocument();
        expect(screen.getByText('FocusForge')).toBeInTheDocument();
    });
    
    it('displays sign-up part', () => {
    
        expect(screen.getByTestId('signup-header')).toBeInTheDocument();
        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByTestId('signup-button')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });
    
    it('displays login part', () => {
    
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
        expect(screen.getByText('Log In')).toBeInTheDocument();
        expect(screen.getByTestId('welcome-header')).toBeInTheDocument();
        expect(screen.getByText('Welcome To Focus Forge!')).toBeInTheDocument();
        expect(screen.getByTestId('greeting-text')).toBeInTheDocument();
        expect(screen.getByText('The Solution To Procrastination')).toBeInTheDocument();
        expect(screen.getByTestId('have-account-text')).toBeInTheDocument();
        expect(screen.getByText("Already HaveAn Account?")).toBeInTheDocument();
    });
    
    it('handles login button click', () => {
        const loginButton = screen.getByTestId('login-button');
        fireEvent.click(loginButton);
    
        expect(window.location.pathname).toBe('/login'); 
    });
    
    }
);