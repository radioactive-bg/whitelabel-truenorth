import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '@/app/login/page';
import { userStore } from '@/state/user';
import { authStore } from '@/state/auth';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/state/user', () => ({
  userStore: jest.fn(() => ({
    user: null,
    setUser: jest.fn(),
  })),
  getUserProfile: jest.fn(() => Promise.resolve({ is2FAEnable: false })),
}));

jest.mock('@/state/auth', () => ({
  authStore: jest.fn(() => ({
    auth: { access_token: null, isLoggedIn: false },
    setAuth: jest.fn(),
  })),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock API requests
global.fetch = jest.fn((url, options) => {
  if (url.includes('/oauth/token')) {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          access_token: 'mock_access_token',
          expires_in: 3600,
          refresh_token: 'mock_refresh_token',
        }),
    });
  }
  return Promise.reject(new Error('Unhandled request'));
}) as jest.Mock;

describe('LoginPage', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Distribution Hub/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('handles login success', async () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  test('shows alert on login failure', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      }),
    );

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith('Invalid credentials'),
    );
  });
});
