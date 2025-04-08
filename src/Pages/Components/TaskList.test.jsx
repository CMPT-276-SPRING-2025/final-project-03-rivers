import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TaskList from './TaskList';
import * as TodoAPI from './Todo';
import '@testing-library/jest-dom/vitest';

// Mock task data
const mockTasks = [
  {
    id: 101,
    content: 'Mock Task',
    due: { date: '2025-04-12' },
    completed: false,
  },
];

// Mock the API module
vi.mock('./Todo', async () => {
  const actual = await vi.importActual('./Todo');
  return {
    ...actual,
    fetchTasks: vi.fn(),
    deleteTask: vi.fn(),
    updateTask: vi.fn(),
    closeTask: vi.fn(),
    reopenTask: vi.fn(),
  };
});

describe('TaskList Component', () => {
  beforeEach(() => {
    TodoAPI.fetchTasks.mockResolvedValue(mockTasks);
  });

  afterEach(() => {
    cleanup(); // THIS is important to clean up DOM between tests
    vi.clearAllMocks();
  });

  const setup = () => render(<TaskList isExiting={false} setShowTaskManager={vi.fn()} />);

  it('renders the task list title and buttons', async () => {
    setup();

    expect(await screen.findByTestId('task-list-title')).toHaveTextContent('To-Do List');
    expect(screen.getByTestId('add-task-button')).toBeInTheDocument();
    expect(screen.getByTestId('close-task-manager')).toBeInTheDocument();
  });

  it('renders a task with content and due date', async () => {
    setup();

    const taskItem = await screen.findByTestId('task-101');
    expect(taskItem).toBeInTheDocument();

    const contentItems = screen.getAllByTestId('task-content-101');
    expect(contentItems[0]).toHaveTextContent('Mock Task');

    const dueItems = screen.getAllByTestId('task-due-101');
    expect(dueItems[0]).toHaveTextContent('2025-04-12');

    expect(screen.getAllByTestId('edit-task-button-101')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('delete-task-button-101')[0]).toBeInTheDocument();
  });

  it('opens TaskForm modal when + button is clicked', async () => {
    setup();

    const addButtons = await screen.findAllByTestId('add-task-button');
    fireEvent.click(addButtons[0]);

    expect(await screen.findByTestId('task-form')).toBeInTheDocument(); // or 'task-form-modal' if that’s what you named it
  });

  it('displays fallback message if no tasks exist', async () => {
    TodoAPI.fetchTasks.mockResolvedValue([]);
    setup();

    expect(await screen.findByTestId('no-tasks-message')).toBeInTheDocument();
    expect(screen.getByText('No Task Available...')).toBeInTheDocument();
  });
});
