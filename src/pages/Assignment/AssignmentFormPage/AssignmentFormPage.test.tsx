import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AssignmentFormPage } from './AssignmentFormPage';
import { useGetAssignment } from '@/hooks/assignments/useGetAssignment';
import type { Assignment } from '@/types/assignment';

// Mock Hooks
vi.mock('@/hooks/assignments/useGetAssignment');

// Mock Child Components
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

vi.mock('@/components/PageHeader', () => ({
  PageHeader: ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock('./components/AssignmentFormSkeleton', () => ({
  AssignmentFormSkeleton: () => (
    <div data-testid="assignment-form-skeleton">Loading Form Skeleton...</div>
  ),
}));

vi.mock('./components/AssignmentForm', () => ({
  AssignmentForm: ({ assignment }: { assignment?: Assignment }) => (
    <div data-testid="assignment-form">
      {assignment ? `Editing ${assignment.title}` : 'Creating New Assignment'}
    </div>
  ),
}));

// Dummy Data
const mockAssignment: Assignment = {
  id: 'assign-123',
  title: 'React Fundamentals',
  shortDescription: 'Short description',
  longDescription: '<p>Long description</p>',
  availableAt: '2026-01-01T00:00:00.000Z',
  dueAt: '2026-01-10T00:00:00.000Z',
} as unknown as Assignment;

describe('AssignmentFormPage Component', () => {
  const renderComponent = (queryString = '') => {
    return render(
      <MemoryRouter initialEntries={[`/assignments/form${queryString}`]}>
        <Routes>
          <Route path="/assignments/form" element={<AssignmentFormPage />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('renders correctly in Create Mode when assignmentId query param is absent', () => {
    vi.mocked(useGetAssignment).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetAssignment>);

    renderComponent();

    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0]).toHaveTextContent('Assignments');
    expect(breadcrumbItems[1]).toHaveTextContent('Create');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Create assignment' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Track your coursework progress and submissions.'),
    ).toBeInTheDocument();

    expect(screen.getByTestId('assignment-form')).toHaveTextContent(
      'Creating New Assignment',
    );
  });

  it('renders skeleton loading state when fetching assignment details in Edit Mode', () => {
    vi.mocked(useGetAssignment).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useGetAssignment>);

    renderComponent('?assignmentId=assign-123');

    expect(screen.getByTestId('assignment-form-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('page-header')).not.toBeInTheDocument();
  });

  it('renders correctly in Edit Mode when assignment data is successfully loaded', () => {
    vi.mocked(useGetAssignment).mockReturnValue({
      data: { data: mockAssignment },
      isLoading: false,
    } as unknown as ReturnType<typeof useGetAssignment>);

    renderComponent('?assignmentId=assign-123');

    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[0]).toHaveTextContent('Assignments');
    expect(breadcrumbItems[1]).toHaveTextContent('assign-123');
    expect(breadcrumbItems[2]).toHaveTextContent('Edit');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Edit assignment' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Update assignment details and content.'),
    ).toBeInTheDocument();

    expect(screen.getByTestId('assignment-form')).toHaveTextContent(
      'Editing React Fundamentals',
    );
  });
});
