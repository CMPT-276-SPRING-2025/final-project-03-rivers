import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import ProjectList from './ProjectList';
import * as TodoAPI from './Todo'; 
import '@testing-library/jest-dom/vitest';

// Mocked data
const mockProjects = [
  { id: 1, name: 'Test Project' },
];

const mockTasks = [
  { id: 101, content: 'Sample Task', projectId: 1, due: { date: '2025-04-12' }, completed: false },
];

// Mock API calls
vi.mock('./Todo', async () => {
  const actual = await vi.importActual('./Todo');
  return {
    ...actual,
    fetchProjects: vi.fn(),
    fetchTasks: vi.fn(),
    deleteTask: vi.fn(),
    deleteProject: vi.fn(),
    closeTask: vi.fn(),
    reopenTask: vi.fn(),
    updateTask: vi.fn(),
  };
});

describe('ProjectList Component', () => {
  beforeEach(() => {
    TodoAPI.fetchProjects.mockResolvedValue(mockProjects);
    TodoAPI.fetchTasks.mockResolvedValue(mockTasks);
    cleanup(); 
  });

  it('renders "No projects yet" when there are no projects', async () => {
    TodoAPI.fetchProjects.mockResolvedValue([]);
    TodoAPI.fetchTasks.mockResolvedValue([]);

    render(<ProjectList />);

    expect(await screen.findByTestId('no-projects-text')).toBeInTheDocument();
    expect(screen.getByText('No projects yet')).toBeInTheDocument();
  });

  it('renders a project with its task', async () => {
    TodoAPI.fetchProjects.mockResolvedValue(mockProjects);
    TodoAPI.fetchTasks.mockResolvedValue(mockTasks);

    render(<ProjectList />);

    expect(await screen.findByTestId('project-list')).toBeInTheDocument();

    expect(screen.getByTestId('project-name')).toHaveTextContent('Test Project');

    expect(screen.getByTestId('task-content-101')).toHaveTextContent('Sample Task');

    expect(screen.getByTestId('task-due-101')).toHaveTextContent('2025-04-12');
  });

  it('edits a task name and due date', async () => {
    render(<ProjectList />);

    expect(await screen.findByTestId('project-name')).toBeInTheDocument();

    const editButton = screen.getByTestId('edit-task-button-101');
    fireEvent.click(editButton);

    expect(await screen.findByTestId('edit-task-modal')).toBeInTheDocument();

    const nameInput = screen.getByTestId('task-name-input');
    fireEvent.change(nameInput, { target: { value: 'Updated Task' } });
    expect(nameInput).toHaveValue('Updated Task');

    const dateInput = screen.getByTestId('task-date-input');
    fireEvent.change(dateInput, { target: { value: '2025-05-01' } });
    expect(dateInput).toHaveValue('2025-05-01');

    const saveButton = screen.getByTestId('save-button');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(TodoAPI.updateTask).toHaveBeenCalledWith({
        id: 101,
        content: 'Updated Task',
        due_date: '2025-05-01'
      });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('edit-task-modal')).not.toBeInTheDocument();
    });
  });
});
