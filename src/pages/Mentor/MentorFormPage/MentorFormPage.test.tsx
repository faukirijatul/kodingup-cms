import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MentorFormPage } from './MentorFormPage';

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

interface MentorFormProps {
  mentorId?: string;
}

vi.mock('./components/MentorForm', () => ({
  MentorForm: ({ mentorId }: MentorFormProps) => (
    <div data-testid="mentor-form">Mentor ID: {mentorId || 'none'}</div>
  ),
}));

describe('MentorFormPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders in create mode when no mentorId search param is present', () => {
    render(
      <MemoryRouter initialEntries={['/mentors/form']}>
        <MentorFormPage />
      </MemoryRouter>,
    );

    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0]).toHaveTextContent('Mentors');
    expect(breadcrumbItems[1]).toHaveTextContent('Create');

    const mentorForm = screen.getByTestId('mentor-form');
    expect(mentorForm).toBeInTheDocument();
    expect(mentorForm).toHaveTextContent('Mentor ID: none');
  });

  it('renders in edit mode when mentorId search param is present', () => {
    render(
      <MemoryRouter initialEntries={['/mentors/form?mentorId=mentor-123']}>
        <MentorFormPage />
      </MemoryRouter>,
    );

    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0]).toHaveTextContent('Mentors');
    expect(breadcrumbItems[1]).toHaveTextContent('Edit');

    const mentorForm = screen.getByTestId('mentor-form');
    expect(mentorForm).toBeInTheDocument();
    expect(mentorForm).toHaveTextContent('Mentor ID: mentor-123');
  });
});
