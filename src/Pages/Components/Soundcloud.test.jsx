import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import Soundcloud from './Soundcloud';

describe('Soundcloud Component', () => {
    beforeAll(() => {
        global.document = {
            createElement: vi.fn(() => ({
                setAttribute: vi.fn(),
                appendChild: vi.fn(),
                removeChild: vi.fn(),
                style: {},
            })),
            getElementById: vi.fn(() => {
                const element = document.createElement('div');
                element.appendChild = vi.fn();
                element.removeChild = vi.fn();
                element.style = {};
                return element;
            }),
            body: {
                appendChild: vi.fn(),
                removeChild: vi.fn(),
            },
        };
    });

    beforeEach(() => {
        // Mock the SoundCloud Widget API
        global.SC = {
            Widget: vi.fn().mockImplementation(() => ({
                bind: vi.fn(),
                getCurrentSound: vi.fn((callback) => callback({ title: 'Test Song' })),
                getSounds: vi.fn((callback) => callback([{ title: 'Test Song 1' }, { title: 'Test Song 2' }])),
                getPosition: vi.fn((callback) => callback(5000)),
                getDuration: vi.fn((callback) => callback(10000)),
                setVolume: vi.fn(),
                seekTo: vi.fn(),
                play: vi.fn(),
                pause: vi.fn(),
                next: vi.fn(),
                prev: vi.fn(),
            })),
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders Soundcloud component', () => {
        render(<Soundcloud />);
        expect(screen.getByText('Test Song')).toBeInTheDocument();
    });

    it('plays and pauses the song', () => {
        render(<Soundcloud />);
        const playButton = screen.getByText('Play');
        fireEvent.click(playButton);
        expect(playButton.textContent).toBe('Pause');
        fireEvent.click(playButton);
        expect(playButton.textContent).toBe('Play');
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
        expect(progressBar.value).toBe('50');
    });

    it('navigates to the next song', () => {
        render(<Soundcloud />);
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
        expect(global.SC.Widget().next).toHaveBeenCalled();
    });

    it('navigates to the previous song', () => {
        <Soundcloud />
        const prevButton = screen.getByText('Previous');
        fireEvent.click(prevButton);
        expect(global.SC.Widget().prev).toHaveBeenCalled();
    });

    it('displays the correct initial volume', () => {
        render(<Soundcloud />);
        const volumeControl = screen.getByRole('slider');
        expect(volumeControl.value).toBe('100');
    });

    it('updates progress bar on interval', () => {
        vi.useFakeTimers();
        render(<Soundcloud />);
        vi.advanceTimersByTime(1000);
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar.value).toBe('50');
        vi.useRealTimers();
    });

    it('updates song name on play', () => {
        render(<Soundcloud />);
        const playButton = screen.getByText('Play');
        fireEvent.click(playButton);
        expect(screen.getByText('Test Song')).toBeInTheDocument();
    });

    it('updates song name on next song', () => {
        render(<Soundcloud />);
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
        expect(screen.getByText('Test Song')).toBeInTheDocument();
    });

    it('updates song name on previous song', () => {
        render(<Soundcloud />);
        const prevButton = screen.getByText('Previous');
        fireEvent.click(prevButton);
        expect(screen.getByText('Test Song')).toBeInTheDocument();
    });

    it('updates total songs count on widget ready', () => {
        render(<Soundcloud />);
        expect(screen.getByText('2')).toBeInTheDocument();
    });
});
