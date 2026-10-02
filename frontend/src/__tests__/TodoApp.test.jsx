import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../api.js', () => ({
  api: {
    register: vi.fn(),
    login: vi.fn(),
    tasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

import App from '../App.jsx';
import { api } from '../api.js';

const loginResponse = {
  token: 'jwt-token',
  user: { id: 1, name: 'Abdul', email: 'a@example.com', role: 'user' },
};

const loginUser = async () => {
  const user = userEvent.setup();
  api.login.mockResolvedValueOnce(loginResponse);
  api.tasks.mockResolvedValueOnce([]);

  render(<App />);
  await user.type(screen.getByPlaceholderText('Email'), 'a@example.com');
  await user.type(screen.getByPlaceholderText('Password (6+ characters)'), 'secret123');
  await user.click(screen.getByRole('button', { name: 'Login' }));
  await screen.findByText('Logged in as');

  return user;
};

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('Connected Todo App', () => {
  it('shows the JWT login screen when no token exists', () => {
    render(<App />);

    expect(screen.getByText('Welcome back 👋')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password (6+ characters)')).toBeInTheDocument();
  });

  it('logs in, stores the JWT, and loads tasks', async () => {
    const task = { id: 1, title: 'Backend task', completed: false };
    const user = userEvent.setup();
    api.login.mockResolvedValueOnce(loginResponse);
    api.tasks.mockResolvedValueOnce([task]);

    render(<App />);
    await user.type(screen.getByPlaceholderText('Email'), 'a@example.com');
    await user.type(screen.getByPlaceholderText('Password (6+ characters)'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Backend task')).toBeInTheDocument();
    expect(localStorage.getItem('jwt')).toBe('jwt-token');
    expect(api.tasks).toHaveBeenCalledTimes(1);
  });

  it('creates a task through the API', async () => {
    const user = await loginUser();
    const newTask = { id: 2, title: 'Learn JWT', completed: false };
    api.createTask.mockResolvedValueOnce(newTask);

    await user.type(screen.getByTestId('todo-input'), 'Learn JWT');
    await user.click(screen.getByTestId('add-button'));

    expect(await screen.findByText('Learn JWT')).toBeInTheDocument();
    expect(api.createTask).toHaveBeenCalledWith({ title: 'Learn JWT', completed: false });
  });

  it('toggles a task through the API', async () => {
    const user = userEvent.setup();
    api.login.mockResolvedValueOnce(loginResponse);
    api.tasks.mockResolvedValueOnce([{ id: 3, title: 'Toggle me', completed: false }]);
    api.updateTask.mockResolvedValueOnce({ id: 3, title: 'Toggle me', completed: true });

    render(<App />);
    await user.type(screen.getByPlaceholderText('Email'), 'a@example.com');
    await user.type(screen.getByPlaceholderText('Password (6+ characters)'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    const checkbox = await screen.findByTestId('toggle-button');
    await user.click(checkbox);

    await waitFor(() => expect(api.updateTask).toHaveBeenCalledWith(3, { completed: true }));
    expect(checkbox).toBeChecked();
  });

  it('deletes a task through the API', async () => {
    const user = userEvent.setup();
    api.login.mockResolvedValueOnce(loginResponse);
    api.tasks.mockResolvedValueOnce([{ id: 4, title: 'Delete me', completed: false }]);
    api.deleteTask.mockResolvedValueOnce(null);

    render(<App />);
    await user.type(screen.getByPlaceholderText('Email'), 'a@example.com');
    await user.type(screen.getByPlaceholderText('Password (6+ characters)'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Delete me')).toBeInTheDocument();
    await user.click(screen.getByTestId('delete-button'));

    await waitFor(() => expect(api.deleteTask).toHaveBeenCalledWith(4));
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
  });
});
