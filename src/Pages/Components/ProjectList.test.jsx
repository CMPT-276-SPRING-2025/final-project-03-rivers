import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import ProjectList from './ProjectList';
import * as TodoAPI from './Todo'; 
import '@testing-library/jest-dom/vitest';

// mocked data
const mockProjects = [
  { id: 1, name: 'Test Project' },
];

const mockTasks = [
  { id: 101, content: 'Sample Task', projectId: 1, due: { date: '2025-04-12' }, completed: false },
];

// mock API calls
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
    // reset mock before each tests
    TodoAPI.fetchProjects.mockResolvedValue(mockProjects);
    TodoAPI.fetchTasks.mockResolvedValue(mockTasks);
    cleanup(); 
  });

  it('renders "No projects yet" when there are no projects', async () => {
    // mock case when no projects are found
    TodoAPI.fetchProjects.mockResolvedValue([]);
    TodoAPI.fetchTasks.mockResolvedValue([]);

    render(<ProjectList />);

    // check is the correct text for no projects is shown properly
    expect(await screen.findByTestId('no-projects-text')).toBeInTheDocument();
    expect(screen.getByText('No projects yet')).toBeInTheDocument();
  });

  it('renders a project with its task', async () => {
    // mock data for projects and tasks
    TodoAPI.fetchProjects.mockResolvedValue(mockProjects);
    TodoAPI.fetchTasks.mockResolvedValue(mockTasks);

    render(<ProjectList />);

    // ensure the texts from projects and tasks are rendered correctly
    expect(await screen.findByTestId('project-list')).toBeInTheDocument();

    expect(screen.getByTestId('project-name')).toHaveTextContent('Test Project');

    expect(screen.getByTestId('task-content-101')).toHaveTextContent('Sample Task');

    expect(screen.getByTestId('task-due-101')).toHaveTextContent('2025-04-12');
  });

  it('edits a task name and due date', async () => {
    render(<ProjectList />);

    // make sure project name is rendered
    expect(await screen.findByTestId('project-name')).toBeInTheDocument();

    // get edit button and check if it opens the modal
    const editButton = screen.getByTestId('edit-task-button-101');
    fireEvent.click(editButton);

    // check if modal is shown
    expect(await screen.findByTestId('edit-task-modal')).toBeInTheDocument();

    // simulate changing task name and due dates
    const nameInput = screen.getByTestId('task-name-input');
    fireEvent.change(nameInput, { target: { value: 'Updated Task' } });
    expect(nameInput).toHaveValue('Updated Task');

    const dateInput = screen.getByTestId('task-date-input');
    fireEvent.change(dateInput, { target: { value: '2025-05-01' } });
    expect(dateInput).toHaveValue('2025-05-01');

    // get save button and save the changes
    const saveButton = screen.getByTestId('save-button');
    fireEvent.click(saveButton);

    // wait for api to be called with the new data
    await waitFor(() => {
      expect(TodoAPI.updateTask).toHaveBeenCalledWith({
        id: 101,
        content: 'Updated Task',
        due_date: '2025-05-01'
      });
    });

    // modal should not be shown after save
    await waitFor(() => {
      expect(screen.queryByTestId('edit-task-modal')).not.toBeInTheDocument();
    });
  });

  it('shows delete project modal when delete button is clicked', async () => {
    render(<ProjectList />);

    // ensure the project list is rendered
    const projectItem = await screen.findByTestId('project-item-1');
    expect(projectItem).toBeInTheDocument();

    // find the delete button for the project
    const deleteButton = screen.getByTestId('delete-project-button-1');
    fireEvent.click(deleteButton); // Simulate clicking the delete button

    // wait for the delete confirmation modal to appear
    const deleteConfirmModal = await screen.findByTestId('delete-project-confirm');
    expect(deleteConfirmModal).toBeInTheDocument(); // Check if the modal shows up

    // check if modal content includes the project name
    expect(screen.getByText(/Delete Project: Test Project?/)).toBeInTheDocument();
  });
});
