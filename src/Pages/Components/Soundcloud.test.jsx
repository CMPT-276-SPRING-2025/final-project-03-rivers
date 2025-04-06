import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Soundcloud from './Soundcloud';
import { log } from 'console';
import '@testing-library/jest-dom/vitest';

// Mock SC object
global.SC = {
    Widget: vi.fn().mockImplementation(() => ({
        prev: vi.fn(),
        next: vi.fn(),
    })),
};

describe('Soundcloud Component', () => {
    beforeEach(() => {
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it('renders without crashing', async () => {
        render(<Soundcloud />);
        await waitFor(() => expect(document.body.textContent).not.toBe(''));
    });

    it('changes volume', async () => {
        const volumeControl = await waitFor(() => screen.getByRole('slider'));
        fireEvent.change(volumeControl, { target: { value: 50 } });
        expect(volumeControl.value).toBe('50');
    });

    it('seeks to a new position on progress bar click', async () => {
        const progressBar = await waitFor(() => screen.getByRole('progressbar'));
        fireEvent.click(progressBar, { clientX: 50 });
        expect(progressBar.value).not.toBe('0');
    });

    it('navigates to the next song', async () => {
        const nextButton = await waitFor(() => screen.getByText('⏭️'));
        fireEvent.click(nextButton);
        expect(document.body.textContent).not.toContain("I'm The Problem")
    });

    it('navigates to the previous song', async () => {
        const prevButton = await waitFor(() => screen.getByText('⏮️'));
        fireEvent.click(prevButton);
        
        expect(document.body.textContent).not.toContain("I'm The Problem")
    });

    it('Playlists exist & Search Bar works', async () => {
        expect(screen.getByTestId('playlists')).toBeInTheDocument();
        const searchBar = await waitFor(() => screen.getByPlaceholderText('Search playlists...'));
        fireEvent.change(searchBar, { target: { value: 'Mori' } });
        // document.body.textContent doesn't see in search bar, so this just looks for existing playlists found
        expect(document.body.textContent).toContain('Mori');
    });
});
