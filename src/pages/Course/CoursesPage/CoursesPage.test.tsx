import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { CoursesPage } from './CoursesPage';

vi.mock('@/components/DashboardHeader', () => ({
  DashboardHeader: ({
    breadcrumbs,
  }: {
    breadcrumbs: Array<{ label: string }>;
  }) => (
    <div data-testid="dashboard-header">
      {breadcrumbs.map((b, index) => (
        <span key={index} data-testid="breadcrumb-item">
          {b.label}
        </span>
      ))}
    </div>
  ),
}));

vi.mock('./components/CoursesTable', () => ({
  CoursesTable: ({
    open,
    selectedCourseId,
    setSelectedCourseId,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCourseId: string;
    setSelectedCourseId: (id: string) => void;
  }) => (
    <div data-testid="courses-table">
      <span data-testid="table-open-state">{open ? 'open' : 'closed'}</span>
      <span data-testid="table-selected-id">{selectedCourseId}</span>
      <button
        data-testid="select-course-button"
        onClick={() => setSelectedCourseId('course-123')}
      >
        Select Course
      </button>
    </div>
  ),
}));

vi.mock('./components/modals/CreateCourseModal', () => ({
  CreateCourseModal: ({
    open,
    onOpenChange,
    selectedCourseId,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCourseId: string;
  }) => (
    <div data-testid="create-course-modal">
      <span>Modal Open: {open ? 'yes' : 'no'}</span>
      <span data-testid="modal-selected-id">Selected: {selectedCourseId}</span>
      <button
        data-testid="close-modal-button"
        onClick={() => onOpenChange(false)}
      >
        Close Modal
      </button>
    </div>
  ),
}));

describe('CoursesPage', () => {
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

  it('renders page layout, header, and courses table correctly', () => {
    render(<CoursesPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-item')).toHaveTextContent('Courses');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Courses' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Manage course content, track progress, and schedule updates',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create course/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('courses-table')).toBeInTheDocument();
    expect(screen.queryByTestId('create-course-modal')).not.toBeInTheDocument();
  });

  it('opens CreateCourseModal when clicking Create Course button', async () => {
    const user = userEvent.setup();
    render(<CoursesPage />, { wrapper: createWrapper() });

    const createButton = screen.getByRole('button', { name: /create course/i });
    await user.click(createButton);

    expect(screen.getByTestId('create-course-modal')).toBeInTheDocument();
    expect(screen.getByTestId('table-open-state')).toHaveTextContent('open');
  });

  it('clears selectedCourseId and closes modal when handleOpenChange is triggered with false', async () => {
    const user = userEvent.setup();
    render(<CoursesPage />, { wrapper: createWrapper() });

    const selectCourseButton = screen.getByTestId('select-course-button');
    await user.click(selectCourseButton);
    expect(screen.getByTestId('table-selected-id')).toHaveTextContent(
      'course-123',
    );

    const createButton = screen.getByRole('button', { name: /create course/i });
    await user.click(createButton);

    expect(screen.getByTestId('modal-selected-id')).toHaveTextContent(
      'Selected: course-123',
    );

    const closeModalButton = screen.getByTestId('close-modal-button');
    await user.click(closeModalButton);

    expect(screen.queryByTestId('create-course-modal')).not.toBeInTheDocument();
    expect(screen.getByTestId('table-selected-id')).toHaveTextContent('');
  });
});
