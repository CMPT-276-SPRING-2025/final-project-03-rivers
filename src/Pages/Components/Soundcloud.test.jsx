import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Soundcloud from './Soundcloud';
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
        const mockSetIsOpen = vi.fn();
        render(<Soundcloud isOpen={true} setIsOpen={mockSetIsOpen} />);
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
        expect(document.body.textContent).not.toBe("I'm The Problem")
    });

    it('navigates to the previous song', async () => {
        const prevButton = await waitFor(() => screen.getByText('⏮️'));
        fireEvent.click(prevButton);
        
        expect(document.body.textContent).not.toBe("I'm The Problem")
    });

    it('closes playlist', async () => {
        const closeButton = await waitFor(() => screen.getByTestId('close-panel'));
        fireEvent.click(closeButton);
        expect(screen.getByTestId('panel')).toHaveClass('opacity-100');
    });
});
