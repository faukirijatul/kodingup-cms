import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssignmentDetailPage } from './AssignmentDetailPage';
import { useGetAssignment } from '@/hooks/assignments/useGetAssignment';
import type { Assignment } from '@/types/assignment';

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/hooks/assignments/useGetAssignment');

interface BreadcrumbItem {
  label: string;
  href?: string;
}

vi.mock('@/components/DashboardHeader', () => ({
  DashboardHeader: ({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) => (
    <div data-testid="dashboard-header">
      {breadcrumbs.map((item, index) => (
        <span key={index} data-testid="breadcrumb-item">
          {item.label}
        </span>
      ))}
    </div>
  ),
}));

vi.mock('./components/AssignmentDetailSkeleton', () => ({
  AssignmentDetailSkeleton: () => (
    <div data-testid="assignment-detail-skeleton">Loading Skeleton...</div>
  ),
}));

vi.mock('@/components/RichTextEditor/RichTextContent', () => ({
  RichTextContent: ({ content }: { content?: string }) => (
    <div data-testid="rich-text-content">{content}</div>
  ),
}));

const mockAssignment: Assignment = {
  id: 'assign-123',
  title: 'React Fundamentals Assignment',
  shortDescription: 'Master basic concepts of React',
  longDescription: '<p>Complete all exercises including state management.</p>',
  availableAt: '2026-01-01T00:00:00.000Z',
  dueAt: '2026-01-10T00:00:00.000Z',
  publishedAt: '2026-01-01T00:00:00.000Z',
  organization: {
    id: 'org-1',
    name: 'KodingUp Academy',
  },
} as unknown as Assignment;

describe('AssignmentDetailPage Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  const renderComponent = (assignmentId = 'assign-123') => {
    return render(
      <MemoryRouter initialEntries={[`/assignments/${assignmentId}`]}>
        <Routes>
          <Route
            path="/assignments/:assignmentId"
            element={<AssignmentDetailPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('renders skeleton loading state while fetching assignment data', () => {
    vi.mocked(useGetAssignment).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useGetAssignment>);

    renderComponent();

    expect(
      screen.getByTestId('assignment-detail-skeleton'),
    ).toBeInTheDocument();
  });

  it('renders assignment detail components correctly when data is loaded', () => {
    vi.mocked(useGetAssignment).mockReturnValue({
      data: { data: mockAssignment },
      isLoading: false,
    } as unknown as ReturnType<typeof useGetAssignment>);

    renderComponent();

    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0]).toHaveTextContent('Assignments');
    expect(breadcrumbItems[1]).toHaveTextContent('assign-123');

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'React Fundamentals Assignment',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Master basic concepts of React'),
    ).toBeInTheDocument();

    expect(screen.getByTestId('rich-text-content')).toHaveTextContent(
      '<p>Complete all exercises including state management.</p>',
    );

    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('KodingUp Academy')).toBeInTheDocument();
    expect(screen.getByText('9 days duration')).toBeInTheDocument();
    expect(
      screen.getByText('Due date: Sat, Jan 10, 2026 - 07:00 AM'),
    ).toBeInTheDocument();
  });

  it('renders unpublished status when assignment is not published', () => {
    const unpublishedAssignment = {
      ...mockAssignment,
      publishedAt: null,
    };

    vi.mocked(useGetAssignment).mockReturnValue({
      data: { data: unpublishedAssignment },
      isLoading: false,
    } as unknown as ReturnType<typeof useGetAssignment>);

    renderComponent();

    expect(screen.getByText('Unpublished')).toBeInTheDocument();
  });

  it('navigates to edit assignment form when Edit Content button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(useGetAssignment).mockReturnValue({
      data: { data: mockAssignment },
      isLoading: false,
    } as unknown as ReturnType<typeof useGetAssignment>);

    renderComponent();

    const editButton = screen.getByRole('button', { name: /edit content/i });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      '/assignments/form?assignmentId=assign-123',
    );
  });
});
