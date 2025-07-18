import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext';
import LoginPage from '../../../pages/LoginPage';
import DashboardPage from '../../../pages/DashboardPage';
import * as authService from '../../../services/authService';

// Mock authService
vi.mock('../../../services/authService', () => ({
  login: vi.fn(),
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
}));

// Mock react-router-dom hooks
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Navigate: ({ to }) => <div>Navigate to: {to}</div>,
  };
});

describe('Login Flow Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should display login form and handle successful login', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    authService.getCurrentUser.mockReturnValueOnce(null);
    authService.login.mockResolvedValueOnce({ user: mockUser, token: 'test-token' });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Check form is rendered
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Fill form fields
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    // Check login function was called with correct data
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });

    // After successful login, user should be redirected (but we're mocking navigation)
    expect(screen.getByText(/navigate to: \/dashboard/i)).toBeInTheDocument();
  });
  
  it('should display validation errors for empty fields', async () => {
    authService.getCurrentUser.mockReturnValueOnce(null);
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Submit form without filling fields
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    // Check validation errors
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    
    // Check login was not called
    expect(authService.login).not.toHaveBeenCalled();
  });
  
  it('should handle login errors', async () => {
    authService.getCurrentUser.mockReturnValueOnce(null);
    authService.login.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill form fields
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong-password');
    
    // Submit form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    // Check error message is displayed
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
  
  it('should redirect to dashboard if already logged in', () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    authService.getCurrentUser.mockReturnValueOnce(mockUser);

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Should redirect instead of showing login form
    expect(screen.queryByRole('heading', { name: /login/i })).not.toBeInTheDocument();
    expect(screen.getByText(/navigate to: \/dashboard/i)).toBeInTheDocument();
  });
});