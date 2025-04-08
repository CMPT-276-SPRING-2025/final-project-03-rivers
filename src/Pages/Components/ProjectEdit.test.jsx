import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ProjectEdit from './ProjectEdit';
import '@testing-library/jest-dom/vitest';

describe('ProjectEdit Component', () => {
  const mockTask = {
    id: '1',
    content: 'Sample Task',
    due: { date: '2025-04-10' },
  };

  let mockOnSave;
  let mockOnCancel;

  beforeEach(() => {
    mockOnSave = vi.fn();
    mockOnCancel = vi.fn();
    render(<ProjectEdit task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />);
  });

  afterEach(() => {
    cleanup(); // Ensures DOM is cleared between tests
  });

  it('renders without crashing', () => {
    expect(screen.getByTestId('project-edit-container')).toBeInTheDocument();
    expect(screen.getByTestId('edit-task-title')).toHaveTextContent('Edit Task');
  });

  it('displays inputs and buttons with correct values', () => {
    const nameInputs = screen.getAllByTestId('task-name-input');
    expect(nameInputs).toHaveLength(1);
    expect(nameInputs[0]).toHaveValue('Sample Task');

    const dateInputs = screen.getAllByTestId('task-date-input');
    expect(dateInputs).toHaveLength(1);
    expect(dateInputs[0]).toHaveValue('2025-04-10');

    expect(screen.getAllByTestId('save-button')).toHaveLength(1);
    expect(screen.getAllByTestId('cancel-button')).toHaveLength(1);
  });

  it('handles cancel button click', () => {
    const cancelButton = screen.getAllByTestId('cancel-button')[0];
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('handles save button click and calls onSave', async () => {
    const saveButton = screen.getAllByTestId('save-button')[0];
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      id: '1',
      content: 'Sample Task',
      due_date: '2025-04-10',
    });

    await waitFor(() => {
        expect(mockOnCancel).toHaveBeenCalled();
      });
  });
});
