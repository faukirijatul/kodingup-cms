import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MentorsList } from './MentorsList';
import { MentorCard } from './MentorCard';
import { useListMentors } from '@/hooks/mentors/useListMentors';
import { toast } from 'sonner';
import type { Mentor } from '@/types/mentor';


vi.mock('@/hooks/mentors/useListMentors');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));


vi.mock('@/components/icons/IconEye', () => ({
  IconEye: () => <span data-testid="icon-eye" />,
}));

vi.mock('@/components/icons/IconVerified', () => ({
  IconVerified: () => <span data-testid="icon-verified" />,
}));

vi.mock('./MentorsListSkeleton', () => ({
  MentorsListSkeleton: () => (
    <div data-testid="mentors-list-skeleton">Loading mentors...</div>
  ),
}));

vi.mock('../MentorDetailModal/MentorDetailModal', () => ({
  MentorDetailModal: ({
    open,
    onOpenChange,
    mentor,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mentor: Mentor | null;
  }) => (
    <div data-testid="mentor-detail-modal">
      <span>Modal Status: {open ? 'open' : 'closed'}</span>
      <span data-testid="modal-mentor-name">
        {mentor ? `${mentor.firstName} ${mentor.lastName}` : ''}
      </span>
      <button
        data-testid="close-modal-button"
        onClick={() => onOpenChange(false)}
      >
        Close Modal
      </button>
    </div>
  ),
}));

const mockMentorsData: { data: Mentor[]; meta: { total: number } } = {
  data: [
    {
      id: 'mentor-1',
      firstName: 'Jane',
      lastName: 'Doe',
      title: 'Senior Software Engineer',
      avatarUrl: 'https://example.com/avatar1.jpg',
      companyLogoUrl: 'https://example.com/company1.png',
      shortDescription: 'Frontend Specialist',
      longDescription: '<p>Detailed bio</p>',
      expertises: ['React', 'TypeScript'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'mentor-2',
      firstName: 'John',
      lastName: 'Smith',
      title: 'DevOps Lead',
      avatarUrl: 'https://example.com/avatar2.jpg',
      companyLogoUrl: 'https://example.com/company2.png',
      shortDescription: 'Cloud Architecture Specialist',
      longDescription: '<p>Detailed bio</p>',
      expertises: ['Docker', 'Kubernetes'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  meta: { total: 2 },
};

describe('Mentors Feature Test Suite', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  describe('1. MentorCard Component', () => {
    it('renders mentor information correctly', () => {
      const mockHandler = vi.fn();
      const mentor = mockMentorsData.data[0];

      render(
        <MentorCard
          mentor={mentor}
          handleOpenMentorDetailModal={mockHandler}
        />,
      );

      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Frontend Specialist')).toBeInTheDocument();

      const images = screen.getAllByRole('img');
      const avatar = images.find(
        (img) => img.getAttribute('alt') === 'Mentor Avatar',
      );
      const companyLogo = images.find(
        (img) => img.getAttribute('alt') === 'Company Logo',
      );

      expect(avatar).toHaveAttribute('src', mentor.avatarUrl);
      expect(companyLogo).toHaveAttribute('src', mentor.companyLogoUrl);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();

      expect(screen.getByTestId('icon-verified')).toBeInTheDocument();
      expect(screen.getByTestId('icon-eye')).toBeInTheDocument();
    });

    it('triggers handleOpenMentorDetailModal when About Mentor button is clicked', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();
      const mentor = mockMentorsData.data[0];

      render(
        <MentorCard
          mentor={mentor}
          handleOpenMentorDetailModal={mockHandler}
        />,
      );

      const aboutButton = screen.getByRole('button', {
        name: /about mentor/i,
      });
      await user.click(aboutButton);

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('2. MentorsList Component', () => {
    beforeEach(() => {
      (useListMentors as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockMentorsData,
        isLoading: false,
      });
    });

    it('renders skeleton loader when isLoading is true', () => {
      (useListMentors as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      render(<MentorsList />, { wrapper: createWrapper() });

      expect(screen.getByTestId('mentors-list-skeleton')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });

    it('renders list of MentorCards when data is loaded', () => {
      render(<MentorsList />, { wrapper: createWrapper() });

      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(
        screen.queryByTestId('mentor-detail-modal'),
      ).not.toBeInTheDocument();
    });

    it('opens MentorDetailModal with selected mentor when About Mentor is clicked', async () => {
      const user = userEvent.setup();
      render(<MentorsList />, { wrapper: createWrapper() });

      const aboutButtons = screen.getAllByRole('button', {
        name: /about mentor/i,
      });
      await user.click(aboutButtons[0]);

      expect(screen.getByTestId('mentor-detail-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-mentor-name')).toHaveTextContent(
        'Jane Doe',
      );
    });

    it('shows toast error when selected mentor ID is not found in data', async () => {
      const user = userEvent.setup();
      render(<MentorsList />, { wrapper: createWrapper() });

      const aboutButtons = screen.getAllByRole('button', {
        name: /about mentor/i,
      });

      aboutButtons[0].setAttribute('data-value', 'invalid-id');
      await user.click(aboutButtons[0]);

      expect(toast.error).toHaveBeenCalledWith('Mentor not found');
      expect(
        screen.queryByTestId('mentor-detail-modal'),
      ).not.toBeInTheDocument();
    });

    it('closes MentorDetailModal when modal triggers onOpenChange with false', async () => {
      const user = userEvent.setup();
      render(<MentorsList />, { wrapper: createWrapper() });

      const aboutButtons = screen.getAllByRole('button', {
        name: /about mentor/i,
      });
      await user.click(aboutButtons[1]);

      expect(screen.getByTestId('mentor-detail-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-mentor-name')).toHaveTextContent(
        'John Smith',
      );

      const closeModalButton = screen.getByTestId('close-modal-button');
      await user.click(closeModalButton);

      expect(
        screen.queryByTestId('mentor-detail-modal'),
      ).not.toBeInTheDocument();
    });
  });
});
