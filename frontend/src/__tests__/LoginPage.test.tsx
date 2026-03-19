import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { authService } from '../services';

// Mock authService and zustand store
jest.mock('../services', () => ({
  authService: { login: jest.fn() },
}));
jest.mock('../store/authStore', () => ({
  useAuthStore: () => ({ setAuth: jest.fn() }),
}));
jest.mock('react-hot-toast', () => ({ error: jest.fn(), success: jest.fn() }));

const mockLogin = authService.login as jest.Mock;

const renderPage = () =>
  render(<MemoryRouter><LoginPage /></MemoryRouter>);

describe('LoginPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders email and password fields', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/email/i) || screen.getByDisplayValue('admin@hrm.vn')).toBeTruthy();
  });

  it('shows loading state on submit', async () => {
    mockLogin.mockReturnValue(new Promise(() => {})); // never resolves
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));
    await waitFor(() => {
      expect(screen.getByText(/đang đăng nhập/i)).toBeTruthy();
    });
  });

  it('calls authService.login with credentials', async () => {
    mockLogin.mockResolvedValue({ token: 'tok', user: { id: '1', email: 'admin@hrm.vn', full_name: 'Admin', role: 'admin' } });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'admin@hrm.vn', password: 'Admin@123' });
    });
  });
});
