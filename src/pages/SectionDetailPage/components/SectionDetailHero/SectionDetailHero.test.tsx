import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SectionDetailHero } from './SectionDetailHero';
import { useGetCourse } from '@/hooks/courses/useGetCourse';
import { useGetCourseSection } from '@/hooks/courseSections/useGetCourseSection';
import { useGetCourseSectionTotals } from '@/hooks/courseSections/useGetCourseSectionTotals';
import { useDeleteCourseSection } from '@/hooks/courseSections/useDeleteCourseSection';
import { toast } from 'sonner';

vi.mock('@/hooks/courses/useGetCourse');
vi.mock('@/hooks/courseSections/useGetCourseSection');
vi.mock('@/hooks/courseSections/useGetCourseSectionTotals');
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

const mockCourseData = {
  data: {
    id: 'course-123',
    description: 'Learn React and TypeScript step by step.',
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
  },
};

const mockSectionData = {
  data: {
    name: 'Introduction to State Management',
    updatedAt: '2026-03-20T00:00:00.000Z',
  },
};

const mockSectionTotalsData = {
  data: {
    totalModules: 8,
    totalDuration: 1800, // 30 mins
  },
};

describe('SectionDetailHero', () => {
  let queryClient: QueryClient;
  const courseId = 'course-123';
  const sectionPosition = '1';

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
    (useGetCourse as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCourseData,
      isLoading: false,
    });
    (
      useGetCourseSection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: mockSectionData,
      isLoading: false,
    });
    (
      useGetCourseSectionTotals as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: mockSectionTotalsData,
      isLoading: false,
    });
    (
      useDeleteCourseSection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders skeleton when any data query is loading', () => {
    (useGetCourse as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(
      <SectionDetailHero
        courseId={courseId}
        sectionPosition={sectionPosition}
      />,
      { wrapper: createWrapper() },
    );

    expect(
      screen.queryByText('Introduction to State Management'),
    ).not.toBeInTheDocument();
  });

  it('renders section hero details correctly when data is loaded', () => {
    render(
      <SectionDetailHero
        courseId={courseId}
        sectionPosition={sectionPosition}
      />,
      { wrapper: createWrapper() },
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Introduction to State Management',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Learn React and TypeScript step by step.'),
    ).toBeInTheDocument();
    expect(screen.getByText('8 modules')).toBeInTheDocument();
    expect(screen.getByText('Updated 2026-03-20')).toBeInTheDocument();

    const image = screen.getByRole('img', {
      name: 'Introduction to State Management',
    });
    expect(image).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
  });

  it('opens delete confirmation modal and triggers deleteSection mutation when confirmed', async () => {
    const user = userEvent.setup();
    const mockDeleteMutate = vi.fn();

    (
      useDeleteCourseSection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    });

    render(
      <SectionDetailHero
        courseId={courseId}
        sectionPosition={sectionPosition}
      />,
      { wrapper: createWrapper() },
    );

    const deleteButton = screen.getByRole('button', {
      name: /delete section/i,
    });
    await user.click(deleteButton);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Delete Section')).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole('button', {
      name: /^delete$/i,
    });
    await user.click(confirmButton);

    expect(mockDeleteMutate).toHaveBeenCalledWith({
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

    render(
      <SectionDetailHero
        courseId={courseId}
        sectionPosition={sectionPosition}
      />,
      { wrapper: createWrapper() },
    );

    onSuccessCallback();

    expect(toast.success).toHaveBeenCalledWith('Section deleted successfully');
    expect(mockNavigate).toHaveBeenCalledWith('/courses/course-123', {
      replace: true,
    });
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

    render(
      <SectionDetailHero
        courseId={courseId}
        sectionPosition={sectionPosition}
      />,
      { wrapper: createWrapper() },
    );

    onErrorCallback(new Error('Deletion failed'));

    expect(toast.error).toHaveBeenCalledWith('Failed to delete section');
  });
});
