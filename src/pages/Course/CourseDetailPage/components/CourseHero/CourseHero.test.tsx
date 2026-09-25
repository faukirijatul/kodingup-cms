import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CourseHero } from './CourseHero';
import { useGetCourse } from '@/hooks/courses/useGetCourse';
import { useGetCourseTotals } from '@/hooks/courses/useGetCourseTotals';
import { useDeleteCourse } from '@/hooks/courses/useDeleteCourse';
import { toast } from 'sonner';

vi.mock('@/hooks/courses/useGetCourse');
vi.mock('@/hooks/courses/useGetCourseTotals');
vi.mock('@/hooks/courses/useDeleteCourse');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock(
  '@/pages/Course/CoursesPage/components/modals/CreateCourseModal',
  () => ({
    CreateCourseModal: ({ open }: { open: boolean }) =>
      open ? (
        <div data-testid="create-course-modal">Create Course Modal</div>
      ) : null,
  }),
);

const mockCourseData = {
  data: {
    id: 'course-123',
    title: 'Fullstack Web Development',
    description: 'Learn fullstack web development from scratch.',
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    updatedAt: '2026-03-15T00:00:00.000Z',
    organizationCourses: [
      {
        organization: {
          name: 'KodingUp Academy',
        },
      },
    ],
  },
};

const mockCourseTotalsData = {
  data: {
    totalModules: 12,
    totalDuration: 3600, // 1 hour
  },
};

describe('CourseHero', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetCourse as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCourseData,
      isLoading: false,
    });
    (useGetCourseTotals as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        data: mockCourseTotalsData,
        isLoading: false,
      },
    );
    (useDeleteCourse as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders skeleton when course or totals are loading', () => {
    (useGetCourse as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<CourseHero courseId="course-123" />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.queryByText('Fullstack Web Development'),
    ).not.toBeInTheDocument();
  });

  it('renders course details correctly when data is loaded', () => {
    render(<CourseHero courseId="course-123" />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Fullstack Web Development',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Learn fullstack web development from scratch.'),
    ).toBeInTheDocument();
    expect(screen.getByText('12 modules')).toBeInTheDocument();
    expect(screen.getByText('Updated 2026-03-15')).toBeInTheDocument();
    expect(screen.getByText('KodingUp Academy')).toBeInTheDocument();

    const image = screen.getByRole('img', {
      name: 'Fullstack Web Development',
    });
    expect(image).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
  });

  it('opens edit course modal when clicking Edit Course button', async () => {
    const user = userEvent.setup();
    render(<CourseHero courseId="course-123" />, {
      wrapper: createWrapper(),
    });

    const editButton = screen.getByRole('button', { name: /edit course/i });
    await user.click(editButton);

    expect(screen.getByTestId('create-course-modal')).toBeInTheDocument();
  });

  it('opens delete confirmation modal and triggers delete mutation when confirmed', async () => {
    const user = userEvent.setup();
    const mockDeleteMutate = vi.fn();

    (useDeleteCourse as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    });

    render(<CourseHero courseId="course-123" />, {
      wrapper: createWrapper(),
    });

    const deleteButton = screen.getByRole('button', { name: /delete course/i });
    await user.click(deleteButton);

    // Targetkan elemen dialog modal untuk menghindari duplikasi teks dengan tombol di hero
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Delete Course')).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole('button', {
      name: /^delete$/i,
    });
    await user.click(confirmButton);

    expect(mockDeleteMutate).toHaveBeenCalledWith('course-123');
  });

  it('handles delete course onSuccess callback correctly', () => {
    let onSuccessCallback: () => void = () => {};

    (useDeleteCourse as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      ({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return { mutate: vi.fn(), isPending: false };
      },
    );

    render(<CourseHero courseId="course-123" />, {
      wrapper: createWrapper(),
    });

    onSuccessCallback();

    expect(toast.success).toHaveBeenCalledWith('Course deleted successfully');
    expect(mockNavigate).toHaveBeenCalledWith('/courses', { replace: true });
  });

  it('handles delete course onError callback correctly', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let onErrorCallback: (error: Error) => void = () => {};

    (useDeleteCourse as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      ({ onError }) => {
        onErrorCallback = onError;
        return { mutate: vi.fn(), isPending: false };
      },
    );

    render(<CourseHero courseId="course-123" />, {
      wrapper: createWrapper(),
    });

    onErrorCallback(new Error('Deletion failed'));

    expect(toast.error).toHaveBeenCalledWith('Failed to delete course');
  });
});
