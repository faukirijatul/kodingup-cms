import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CourseSectionsTable } from './CourseSectionsTable';
import { useListCourseSections } from '@/hooks/courseSections/useListCourseSections';
import { useDeleteCourseSection } from '@/hooks/courseSections/useDeleteCourseSection';
import { toast } from 'sonner';

vi.mock('@/hooks/courseSections/useListCourseSections');
vi.mock('@/hooks/courseSections/useDeleteCourseSection');
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

const mockSectionsData = {
  data: [
    {
      position: '1',
      name: 'Introduction to React',
    },
    {
      position: '2',
      name: 'Hooks Deep Dive',
    },
  ],
  meta: {
    total: 2,
  },
};

describe('CourseSectionsTable', () => {
  let queryClient: QueryClient;
  const courseId = 'course-123';

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
    (
      useListCourseSections as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: mockSectionsData,
      isLoading: false,
    });
    (
      useDeleteCourseSection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders skeleton rows when loading course sections', () => {
    (
      useListCourseSections as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<CourseSectionsTable courseId={courseId} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Sections (2)')).toBeInTheDocument();
    expect(screen.queryByText('Introduction to React')).not.toBeInTheDocument();
  });

  it('renders list of course sections correctly', () => {
    render(<CourseSectionsTable courseId={courseId} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
    expect(screen.getByText('Hooks Deep Dive')).toBeInTheDocument();
    expect(screen.getAllByText('5 Modules')).toHaveLength(2);
  });

  it('renders empty table row when sections list is empty', () => {
    (
      useListCourseSections as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    });

    render(<CourseSectionsTable courseId={courseId} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('No sections found.')).toBeInTheDocument();
  });

  it('navigates to section detail on View Section action', async () => {
    const user = userEvent.setup();
    render(<CourseSectionsTable courseId={courseId} />, {
      wrapper: createWrapper(),
    });

    const actionButtons = screen.getAllByRole('button', {
      name: /more actions/i,
    });
    await user.click(actionButtons[0]);

    const viewItem = await screen.findByText('View Section');
    await user.click(viewItem);

    expect(mockNavigate).toHaveBeenCalledWith('sections/1');
  });

  it('opens delete modal and triggers deleteSection mutation when confirmed', async () => {
    const user = userEvent.setup();
    const mockDelete = vi.fn();
    (
      useDeleteCourseSection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      mutate: mockDelete,
      isPending: false,
    });

    render(<CourseSectionsTable courseId={courseId} />, {
      wrapper: createWrapper(),
    });

    const actionButtons = screen.getAllByRole('button', {
      name: /more actions/i,
    });
    await user.click(actionButtons[0]);

    const removeItem = await screen.findByText('Remove Section');
    await user.click(removeItem);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Delete Section')).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole('button', {
      name: /^delete$/i,
    });
    await user.click(confirmButton);

    expect(mockDelete).toHaveBeenCalledWith({
      courseId: 'course-123',
      sectionPosition: '1',
    });
  });

  it('handles delete section onSuccess callback correctly', () => {
    let onSuccessCallback: () => void = () => {};

    (
      useDeleteCourseSection as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(({ onSuccess }) => {
      onSuccessCallback = onSuccess;
      return { mutate: vi.fn(), isPending: false };
    });

    render(<CourseSectionsTable courseId={courseId} />, {
      wrapper: createWrapper(),
    });

    onSuccessCallback();

    expect(toast.success).toHaveBeenCalledWith('Section deleted successfully');
  });

  it('handles delete section onError callback correctly', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let onErrorCallback: (error: Error) => void = () => {};

    (
      useDeleteCourseSection as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(({ onError }) => {
      onErrorCallback = onError;
      return { mutate: vi.fn(), isPending: false };
    });

    render(<CourseSectionsTable courseId={courseId} />, {
      wrapper: createWrapper(),
    });

    onErrorCallback(new Error('Delete error'));

    expect(toast.error).toHaveBeenCalledWith('Failed to delete section');
  });
});
