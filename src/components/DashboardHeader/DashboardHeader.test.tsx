import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import { DashboardHeader, type BreadcrumbItem } from '../DashboardHeader';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { HttpService } from '@/services/http';
import { authHttpKeys } from '@/configs/httpKeys';
import { toast } from 'sonner';

vi.mock('@/hooks/useCurrentUser');
vi.mock('@/services/http');
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockedUseCurrentUser = vi.mocked(useCurrentUser);
const mockedHttpService = vi.mocked(HttpService);

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const defaultBreadcrumbs: BreadcrumbItem[] = [
  { label: 'Students', href: '/students' },
  { label: 'Enrolled' },
];

const renderDashboardHeader = (breadcrumbs = defaultBreadcrumbs) => {
  const queryClient = createTestQueryClient();
  const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData');
  const clearSpy = vi.spyOn(queryClient, 'clear');

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DashboardHeader breadcrumbs={breadcrumbs} />
      </MemoryRouter>
    </QueryClientProvider>,
  );

  return { ...renderResult, queryClient, setQueryDataSpy, clearSpy };
};

describe('DashboardHeader', () => {
  describe('Breadcrumbs Rendering', () => {
    it('renders breadcrumbs correctly with links and text', () => {
      mockedUseCurrentUser.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        isError: false,
        isSuccess: false,
      } as unknown as ReturnType<typeof useCurrentUser>);

      renderDashboardHeader();

      const linkElement = screen.getByRole('link', { name: 'Students' });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', '/students');

      const textElement = screen.getByText('Enrolled');
      expect(textElement).toBeInTheDocument();
      expect(textElement.tagName).toBe('SPAN');
    });
  });

  describe('User Profile & Avatar Display', () => {
    it('does not render user avatar section when loading or unauthenticated', () => {
      mockedUseCurrentUser.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      } as ReturnType<typeof useCurrentUser>);

      renderDashboardHeader();

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders user initials when displayName is available without photoURL', () => {
      const mockUser = {
        uid: '123',
        email: 'john.doe@example.com',
        displayName: 'John Doe',
        photoURL: null,
      } as User;

      mockedUseCurrentUser.mockReturnValue({
        data: mockUser,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      } as ReturnType<typeof useCurrentUser>);

      renderDashboardHeader();

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('falls back to email initials when displayName is not present', () => {
      const mockUser = {
        uid: '123',
        email: 'alex@example.com',
        displayName: null,
        photoURL: null,
      } as User;

      mockedUseCurrentUser.mockReturnValue({
        data: mockUser,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      } as ReturnType<typeof useCurrentUser>);

      renderDashboardHeader();

      expect(screen.getByText('al')).toBeInTheDocument();
    });
  });

  describe('User Menu & Logout Flow', () => {
    const mockUser = {
      uid: '123',
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      photoURL: 'https://example.com/photo.jpg',
    } as User;

    beforeEach(() => {
      mockedUseCurrentUser.mockReturnValue({
        data: mockUser,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      } as ReturnType<typeof useCurrentUser>);
    });

    it('opens dropdown menu and displays user details on trigger click', async () => {
      const user = userEvent.setup();
      renderDashboardHeader();

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(await screen.findByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: /log out/i }),
      ).toBeInTheDocument();
    });

    it('calls HttpService.logout and clears QueryClient state on successful logout', async () => {
      const user = userEvent.setup();
      mockedHttpService.logout.mockResolvedValueOnce(undefined);

      const { setQueryDataSpy, clearSpy } = renderDashboardHeader();

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const logoutItem = await screen.findByRole('menuitem', {
        name: /log out/i,
      });
      await user.click(logoutItem);

      await waitFor(() => {
        expect(mockedHttpService.logout).toHaveBeenCalledTimes(1);
        expect(setQueryDataSpy).toHaveBeenCalledWith(
          authHttpKeys.currentUser,
          null,
        );
        expect(clearSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('displays error toast if HttpService.logout fails', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockedHttpService.logout.mockRejectedValueOnce(
        new Error('Network Error'),
      );

      renderDashboardHeader();

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const logoutItem = await screen.findByRole('menuitem', {
        name: /log out/i,
      });
      await user.click(logoutItem);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Logout failed');
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
