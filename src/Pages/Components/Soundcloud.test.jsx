import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Soundcloud from './Soundcloud';

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
    it('renders without crashing', () => {
        render(<Soundcloud />);
        expect(screen.getByText('Play')).toBeInTheDocument();
    });

    it('displays the song name', () => {
        render(<Soundcloud />);
        expect(screen.getByText('')).toBeInTheDocument();
    });

    it('toggles play and pause', () => {
        render(<Soundcloud />);
        const playButton = screen.getByText('Play');
        fireEvent.click(playButton);
        expect(screen.getByText('Pause')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Pause'));
        expect(screen.getByText('Play')).toBeInTheDocument();
    });

    it('changes volume', () => {
        render(<Soundcloud />);
        const volumeControl = screen.getByRole('slider');
        fireEvent.change(volumeControl, { target: { value: 50 } });
        expect(volumeControl.value).toBe('50');
    });

    it('seeks to a new position on progress bar click', () => {
        render(<Soundcloud />);
        const progressBar = screen.getByRole('progressbar');
        fireEvent.click(progressBar, { clientX: 50 });
        expect(progressBar.value).not.toBe('0');
    });

    it('navigates to the next song', () => {
        render(<Soundcloud />);
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
        expect(console.log).toHaveBeenCalledWith('Next Song');
    });

    it('navigates to the previous song', () => {
        render(<Soundcloud />);
        const prevButton = screen.getAllByText('Previous')[0];
        fireEvent.click(prevButton);
        expect(console.log).toHaveBeenCalledWith('Previous Song');
    });
});