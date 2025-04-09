import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import TaskForm from './TaskForm';
import * as TodoAPI from './Todo';
import '@testing-library/jest-dom/vitest';

vi.mock('./Todo', async () => {
  const actual = await vi.importActual('./Todo');
  return {
    ...actual,
    addTask: vi.fn(() => Promise.resolve({ id: 'new-task' })),
    updateTask: vi.fn(),
    addProject: vi.fn(() => Promise.resolve({ id: 'new-project', name: 'New Project' })),
    fetchProjects: vi.fn(() => Promise.resolve([{ id: 'p1', name: 'Test Project' }])),
    deleteProject: vi.fn(() => Promise.resolve())
  };
});

describe('TaskForm Component', () => {
  const mockNewTaskAdded = vi.fn();
  const mockSetShowForm = vi.fn();

  beforeEach(() => {
    cleanup();
    mockNewTaskAdded.mockClear();
    mockSetShowForm.mockClear();
  });

  it('creates a new project', async () => {
    render(<TaskForm newTaskAdded={mockNewTaskAdded} setShowForm={mockSetShowForm} />);

    const addProjectBtn = await screen.findByTestId('add-project-button');
    fireEvent.click(addProjectBtn);

    const input = screen.getByTestId('new-project-input');
    fireEvent.change(input, { target: { value: 'New Project' } });

    const createBtn = screen.getByTestId('create-project-button');
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(TodoAPI.addProject).toHaveBeenCalledWith('New Project');
    });
  });

  it('creates a new task', async () => {
    render(<TaskForm newTaskAdded={mockNewTaskAdded} setShowForm={mockSetShowForm} />);

    const taskInput = await screen.findByTestId('task-input');
    fireEvent.change(taskInput, { target: { value: 'Test task content' } });

    const projectSelect = screen.getByTestId('project-select');
    fireEvent.change(projectSelect, { target: { value: 'p1' } });

    const warningConfirm = await screen.findByTestId('project-warning-confirm');
    fireEvent.click(warningConfirm);

    const submitButton = screen.getByTestId('submit-task-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(TodoAPI.addTask).toHaveBeenCalledWith('Test task content', '', 'p1');
      expect(mockNewTaskAdded).toHaveBeenCalled();
    });
  });

  it('sets a due date', async () => {
    render(<TaskForm newTaskAdded={mockNewTaskAdded} setShowForm={mockSetShowForm} />);

    const dateInput = await screen.findByTestId('due-date-input');
    fireEvent.change(dateInput, { target: { value: '2025-05-01' } });

    expect(dateInput).toHaveValue('2025-05-01');
  });

  it('handles cancel button click', async () => {
    render(<TaskForm newTaskAdded={mockNewTaskAdded} setShowForm={mockSetShowForm} />);

    const cancelBtn = await screen.findByTestId('cancel-task-button');
    fireEvent.click(cancelBtn);

    expect(mockSetShowForm).toHaveBeenCalledWith(false);
  });

  it('triggers add project button', async () => {
    render(<TaskForm newTaskAdded={mockNewTaskAdded} setShowForm={mockSetShowForm} />);

    const btn = await screen.findByTestId('add-project-button');
    fireEvent.click(btn);

    expect(screen.getByTestId('create-project-section')).toBeInTheDocument();
  });

  it('opens delete project confirmation modal', async () => {
    render(<TaskForm newTaskAdded={mockNewTaskAdded} setShowForm={mockSetShowForm} />);

    // Set a project to enable delete button
    const projectSelect = await screen.findByTestId('project-select');
    fireEvent.change(projectSelect, { target: { value: 'p1' } });

    const warningConfirm = await screen.findByTestId('project-warning-confirm');
    fireEvent.click(warningConfirm);

    const deleteBtn = screen.getByTestId('delete-project-button');
    fireEvent.click(deleteBtn);

    expect(await screen.findByTestId('delete-project-modal')).toBeInTheDocument();
  });

  it('confirms project deletion', async () => {
    render(<TaskForm newTaskAdded={mockNewTaskAdded} setShowForm={mockSetShowForm} />);

    // Select a project
    const projectSelect = await screen.findByTestId('project-select');
    fireEvent.change(projectSelect, { target: { value: 'p1' } });

    const warningConfirm = await screen.findByTestId('project-warning-confirm');
    fireEvent.click(warningConfirm);

    fireEvent.click(screen.getByTestId('delete-project-button'));

    const confirmDelete = await screen.findByTestId('confirm-delete-project');
    fireEvent.click(confirmDelete);

    await waitFor(() => {
      expect(TodoAPI.deleteProject).toHaveBeenCalledWith('p1');
    });
  });

  it('displays form with correct texts and elements', async () => {
    render(<TaskForm newTaskAdded={() => {}} setShowForm={() => {}} />);

    expect(await screen.findByTestId('task-form-title')).toHaveTextContent('Create Task');
    expect(screen.getByTestId('project-select')).toBeInTheDocument();
    expect(screen.getByTestId('add-project-button')).toBeInTheDocument();
    expect(screen.queryByTestId('project-warning-text')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-assignment-notice')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-modal-notice')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-project-warning')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-project-title')).not.toBeInTheDocument();
  });
});
