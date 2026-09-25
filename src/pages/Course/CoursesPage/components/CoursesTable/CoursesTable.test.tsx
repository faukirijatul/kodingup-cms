import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CoursesTable } from './CoursesTable';
import { useListCourses } from '@/hooks/courses/useListCourses';
import { useDeleteCourse } from '@/hooks/courses/useDeleteCourse';
import { toast } from 'sonner';

vi.mock('@/hooks/courses/useListCourses');
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

const mockCoursesData = {
  data: [
    {
      id: 'course-1',
      title: 'React Fundamentals',
      description: 'Learn the basics of React',
      thumbnailUrl: 'https://example.com/react.png',
      organizationCourses: [
        { id: 'org-course-1', organization: { name: 'Org Alpha' } },
      ],
    },
    {
      id: 'course-2',
      title: 'Advanced TypeScript',
      description: 'Deep dive into TypeScript',
      thumbnailUrl: 'https://example.com/ts.png',
      organizationCourses: [
        { id: 'org-course-2', organization: { name: 'Org Beta' } },
      ],
    },
  ],
  meta: {
    total: 2,
  },
};

describe('CoursesTable', () => {
  let queryClient: QueryClient;
  const defaultProps = {
    open: false,
    onOpenChange: vi.fn(),
    selectedCourseId: '',
    setSelectedCourseId: vi.fn(),
  };

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
    (useListCourses as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCoursesData,
      isLoading: false,
    });
    (useDeleteCourse as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders skeleton rows when loading courses', () => {
    (useListCourses as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<CoursesTable {...defaultProps} />, { wrapper: createWrapper() });

    expect(screen.getByText('Courses (0)')).toBeInTheDocument();
  });

  it('renders courses list correctly', () => {
    render(<CoursesTable {...defaultProps} />, { wrapper: createWrapper() });

    expect(screen.getByText('Courses (2)')).toBeInTheDocument();
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Learn the basics of React')).toBeInTheDocument();
    expect(screen.getByText('Org Alpha')).toBeInTheDocument();
    expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument();
  });

  it('renders empty table row when courses list is empty', () => {
    (useListCourses as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    });

    render(<CoursesTable {...defaultProps} />, { wrapper: createWrapper() });

    expect(screen.getByText('No courses found.')).toBeInTheDocument();
  });

  it('updates search query in URL input', async () => {
    const user = userEvent.setup();
    render(<CoursesTable {...defaultProps} />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText(
      'Search by title or description',
    );
    await user.type(searchInput, 'React');

    expect(searchInput).toHaveValue('React');
  });

  it('navigates to course detail page on View Course action', async () => {
    const user = userEvent.setup();
    render(<CoursesTable {...defaultProps} />, { wrapper: createWrapper() });

    const actionButtons = screen.getAllByRole('button', {
      name: /more actions/i,
    });
    await user.click(actionButtons[0]);

    const viewItem = await screen.findByText('View Course');
    await user.click(viewItem);

    expect(mockNavigate).toHaveBeenCalledWith('/courses/course-1', {
      replace: true,
      state: { courseId: 'course-1' },
    });
  });

  it('opens update modal and sets selected course id on Edit Course action', async () => {
    const user = userEvent.setup();
    const setSelectedCourseId = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <CoursesTable
        {...defaultProps}
        setSelectedCourseId={setSelectedCourseId}
        onOpenChange={onOpenChange}
      />,
      { wrapper: createWrapper() },
    );

    const actionButtons = screen.getAllByRole('button', {
      name: /more actions/i,
    });
    await user.click(actionButtons[0]);

    const editItem = await screen.findByText('Edit Course');
    await user.click(editItem);

    expect(setSelectedCourseId).toHaveBeenCalledWith('course-1');
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('opens delete confirmation modal and executes delete mutation', async () => {
    const user = userEvent.setup();
    const mockDelete = vi.fn();
    (useDeleteCourse as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockDelete,
      isPending: false,
    });

    render(<CoursesTable {...defaultProps} />, { wrapper: createWrapper() });

    const actionButtons = screen.getAllByRole('button', {
      name: /more actions/i,
    });
    await user.click(actionButtons[0]);

    const removeItem = await screen.findByText('Remove Course');
    await user.click(removeItem);

    expect(screen.getByText('Delete Course')).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmButton);

    expect(mockDelete).toHaveBeenCalledWith('course-1');
  });

  it('handles delete course success callback correctly', async () => {
    let onSuccessCallback: () => void = () => {};

    (useDeleteCourse as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      ({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return { mutate: vi.fn(), isPending: false };
      },
    );

    render(<CoursesTable {...defaultProps} />, { wrapper: createWrapper() });

    onSuccessCallback();

    expect(toast.success).toHaveBeenCalledWith('Course deleted successfully');
  });

  it('handles delete course error callback correctly', async () => {
    let onErrorCallback: (error: Error) => void = () => {};

    (useDeleteCourse as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      ({ onError }) => {
        onErrorCallback = onError;
        return { mutate: vi.fn(), isPending: false };
      },
    );

    render(<CoursesTable {...defaultProps} />, { wrapper: createWrapper() });

    onErrorCallback(new Error('Delete error'));

    expect(toast.error).toHaveBeenCalledWith('Failed to delete course');
  });
});
