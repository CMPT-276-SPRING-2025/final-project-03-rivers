import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

    it('renders without crashing', async () => {
        render(<Soundcloud />);
        await waitFor(() => expect(document.body.textContent).not.toBe(''));
    });

    it('changes volume', async () => {
        render(<Soundcloud />);
        const volumeControl = await waitFor(() => screen.getAllByRole('slider')[0]);
        fireEvent.change(volumeControl, { target: { value: 50 } });
        expect(volumeControl.value).toBe('50');
    });

    it('seeks to a new position on progress bar click', async () => {
        render(<Soundcloud />);
        const progressBar = await waitFor(() => screen.getAllByRole('progressbar')[0]);
        fireEvent.click(progressBar, { clientX: 50 });
        expect(progressBar.value).not.toBe('0');
    });

    it('navigates to the next song', async () => {
        render(<Soundcloud />);
        const nextButton = await waitFor(() => screen.getAllByText('Next')[0]);
        fireEvent.click(nextButton);
        expect(console.log).toHaveBeenCalledWith('Next Song');
    });

    it('navigates to the previous song', async () => {
        render(<Soundcloud />);
        const prevButton = await waitFor(() => screen.getAllByText('Previous')[0]);
        fireEvent.click(prevButton);
        expect(console.log).toHaveBeenCalledWith('Previous Song');
    });
});
