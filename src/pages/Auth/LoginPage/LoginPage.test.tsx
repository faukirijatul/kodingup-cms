import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import { LoginPage } from './LoginPage';
import { GuestRoute } from '@/routes/components/GuestRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { HttpService } from '@/services/http';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from 'sonner';

vi.mock('@/services/http');
vi.mock('@/hooks/useCurrentUser');
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockedHttpService = vi.mocked(HttpService);
const mockedUseCurrentUser = vi.mocked(useCurrentUser);

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderLoginPage = (initialPath = '/login') => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Route>
          <Route path="/students" element={<div>Students Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('LoginPage Integration', () => {
  describe('GuestRoute Guard Protection', () => {
    it('redirects to /students if the user is authenticated', () => {
      const mockUser = {
        uid: '123',
        email: 'user@example.com',
      } as unknown as User;

      mockedUseCurrentUser.mockReturnValue({
        data: mockUser,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      } as ReturnType<typeof useCurrentUser>);

      renderLoginPage();

      expect(screen.getByText('Students Page')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /sign in/i }),
      ).not.toBeInTheDocument();
    });

    it('renders the login page if the user is unauthenticated', () => {
      mockedUseCurrentUser.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      } as ReturnType<typeof useCurrentUser>);

      renderLoginPage();

      expect(
        screen.getByRole('heading', { name: /sign in/i }),
      ).toBeInTheDocument();
      expect(screen.queryByText('Students Page')).not.toBeInTheDocument();
    });
  });

  describe('Form & Input Validation', () => {
    beforeEach(() => {
      mockedUseCurrentUser.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      } as ReturnType<typeof useCurrentUser>);
    });

    it('displays Zod validation errors when submitting an empty form', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      expect(
        await screen.findByText('Password is required'),
      ).toBeInTheDocument();
    });

    it('displays validation errors when email format and password length are invalid', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, '123');
      await user.click(submitButton);

      expect(
        await screen.findByText('Please enter a valid email address'),
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Password must be at least 8 characters'),
      ).toBeInTheDocument();
    });
  });

  describe('Login Submission & API Calls', () => {
    beforeEach(() => {
      mockedUseCurrentUser.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      } as ReturnType<typeof useCurrentUser>);
    });

    it('calls HttpService.login with correct credentials on successful submission', async () => {
      const user = userEvent.setup();
      const mockAuthData = {
        user: {
          uid: '123',
          email: 'test@example.com',
          emailVerified: true,
          displayName: 'Test User',
          photoURL: null,
        },
        token: 'fake-token',
        refreshToken: 'fake-refresh',
        expirationTime: 1000,
      };

      mockedHttpService.login.mockResolvedValueOnce(mockAuthData);

      renderLoginPage();

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockedHttpService.login).toHaveBeenCalledWith(
          {
            email: 'test@example.com',
            password: 'password123',
          },
          expect.anything(),
        );
      });
    });

    it('triggers error toast when the login mutation fails', async () => {
      const user = userEvent.setup();
      mockedHttpService.login.mockRejectedValueOnce(
        new Error('Invalid credentials'),
      );

      renderLoginPage();

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to sign in');
      });
    });
  });
});
