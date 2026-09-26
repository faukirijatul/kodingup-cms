import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { AssignmentsPage } from './AssignmentsPage';

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

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardHeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

vi.mock('@/components/DashboardHeader', () => ({
  DashboardHeader: ({ breadcrumbs }: DashboardHeaderProps) => (
    <div data-testid="dashboard-header">
      {breadcrumbs.map((item, index) => (
        <span key={index} data-testid="breadcrumb-item">
          {item.label}
        </span>
      ))}
    </div>
  ),
}));

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

vi.mock('@/components/PageHeader', () => ({
  PageHeader: ({ title, description, children }: PageHeaderProps) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

vi.mock('./components/AssignmentsTable', () => ({
  AssignmentsTable: () => (
    <div data-testid="assignments-table">Assignments Table Content</div>
  ),
}));

describe('AssignmentsPage Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AssignmentsPage />
      </MemoryRouter>,
    );
  };

  it('renders DashboardHeader, PageHeader, and AssignmentsTable correctly', () => {
    renderComponent();

    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(1);
    expect(breadcrumbItems[0]).toHaveTextContent('Assignments');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Assignments',
    );
    expect(
      screen.getByText('Track your coursework progress and submissions'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /create assignment/i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId('assignments-table')).toBeInTheDocument();
  });

  it('navigates to form page when Create Assignment button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const createButton = screen.getByRole('button', {
      name: /create assignment/i,
    });
    await user.click(createButton);

    expect(mockNavigate).toHaveBeenCalledWith('form');
  });
});
