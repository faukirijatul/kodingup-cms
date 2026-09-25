import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CourseSectionModulesTable } from './CourseSectionModulesTable';
import { useListCourseSectionModules } from '@/hooks/courseSectionModules/useListCourseSectionModules';
import { useDeleteCourseSectionModule } from '@/hooks/courseSectionModules/useDeleteCourseSectionModule';
import { toast } from 'sonner';

vi.mock('@/hooks/courseSectionModules/useListCourseSectionModules');
vi.mock('@/hooks/courseSectionModules/useDeleteCourseSectionModule');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockModulesData = {
  data: [
    {
      courseSectionId: 'section-module-1',
      position: '1',
      title: 'Introduction to Components',
      type: 'video',
      duration: 600, // 10m
    },
    {
      courseSectionId: 'section-module-2',
      position: '2',
      title: 'Understanding Props & State',
      type: 'article',
      duration: 300, // 5m
    },
  ],
  meta: {
    total: 2,
  },
};

describe('CourseSectionModulesTable', () => {
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
    (
      useListCourseSectionModules as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: mockModulesData,
      isLoading: false,
    });
    (
      useDeleteCourseSectionModule as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders skeleton rows when loading modules', () => {
    (
      useListCourseSectionModules as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(
      <CourseSectionModulesTable
        courseId={courseId}
        sectionPosition={sectionPosition}
      />,
      { wrapper: createWrapper() },
    );

    expect(
      screen.queryByText('Introduction to Components'),
    ).not.toBeInTheDocument();
  });

  it('renders list of section modules correctly', () => {
    render(
      <CourseSectionModulesTable
        courseId={courseId}
        sectionPosition={sectionPosition}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Introduction to Components')).toBeInTheDocument();
    expect(screen.getByText('Understanding Props & State')).toBeInTheDocument();
    expect(screen.getByText('video')).toBeInTheDocument();
    expect(screen.getByText('article')).toBeInTheDocument();
  });

  it('renders empty table row when modules list is empty', () => {
    (
      useListCourseSectionModules as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    });

    render(
      <CourseSectionModulesTable
        courseId={courseId}
        sectionPosition={sectionPosition}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('No modules found.')).toBeInTheDocument();
  });

  it('opens delete modal and triggers deleteModule mutation when confirmed', async () => {
    const user = userEvent.setup();
    const mockDelete = vi.fn();
    (
      useDeleteCourseSectionModule as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      mutate: mockDelete,
      isPending: false,
    });

    render(
      <CourseSectionModulesTable
        courseId={courseId}
        sectionPosition={sectionPosition}
      />,
      { wrapper: createWrapper() },
    );

    const actionButtons = screen.getAllByRole('button', {
      name: /more actions/i,
    });
    await user.click(actionButtons[0]);

    const removeItem = await screen.findByText('Remove Module');
    await user.click(removeItem);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Delete Module')).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole('button', {
      name: /^delete$/i,
    });
    await user.click(confirmButton);

    expect(mockDelete).toHaveBeenCalledWith({
      courseId: 'course-123',
      sectionPosition: '1',
      modulePosition: '1',
    });
  });

  it('handles delete module onSuccess callback correctly', () => {
    let onSuccessCallback: () => void = () => {};

    (
      useDeleteCourseSectionModule as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(({ onSuccess }) => {
      onSuccessCallback = onSuccess;
      return { mutate: vi.fn(), isPending: false };
    });

    render(
      <CourseSectionModulesTable
        courseId={courseId}
        sectionPosition={sectionPosition}
      />,
      { wrapper: createWrapper() },
    );

    onSuccessCallback();

    expect(toast.success).toHaveBeenCalledWith('Module deleted successfully');
  });

  it('handles delete module onError callback correctly', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let onErrorCallback: (error: Error) => void = () => {};

    (
      useDeleteCourseSectionModule as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(({ onError }) => {
      onErrorCallback = onError;
      return { mutate: vi.fn(), isPending: false };
    });

    render(
      <CourseSectionModulesTable
        courseId={courseId}
        sectionPosition={sectionPosition}
      />,
      { wrapper: createWrapper() },
    );

    onErrorCallback(new Error('Delete error'));

    expect(toast.error).toHaveBeenCalledWith('Failed to delete module');
  });
});
