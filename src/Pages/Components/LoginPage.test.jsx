import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock the `useNavigate` function from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('LoginPage', () => {
  it('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Check if login form elements exist
    expect(screen.getByText('Log In To Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('navigates to /loading and then to /home on login click', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    // Use fake timers to control the timing of setTimeout
    vi.useFakeTimers();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Click login button
    fireEvent.click(screen.getByText('Login'));

    // Check if navigate was called with /loading
    expect(mockNavigate).toHaveBeenCalledWith('/loading');

    // Fast-forward timers by 5 seconds to trigger the timeout
    vi.advanceTimersByTime(5000);

    // Check if navigate was called with /home
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('renders navigation bar correctly', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Check if navigation bar elements exist
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Focus Forge')).toBeInTheDocument();
    expect(screen.getByAltText('question icon about project')).toBeInTheDocument();
  });

  it('renders about section correctly', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Check if about section text exists
    expect(
      screen.getByText(
        /This is a webapp designed to help students and people with time-management issues manage their time while leaving space for free time./
      )
    ).toBeInTheDocument();
  });

  it('renders signup section correctly', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  
    // Log the entire HTML to inspect
    screen.debug();
  
    await waitFor(() => {
        expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
        expect(screen.getByText('Ready to focus?')).toBeInTheDocument();
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });
});
});
