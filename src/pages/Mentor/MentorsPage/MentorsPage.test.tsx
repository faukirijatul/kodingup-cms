import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { MentorsPage } from './MentorsPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('lucide-react', () => ({
  Plus: () => <span data-testid="icon-plus" />,
}));

vi.mock('@/components/DashboardHeader', () => ({
  DashboardHeader: ({ breadcrumbs }: { breadcrumbs: { label: string }[] }) => (
    <div data-testid="dashboard-header">
      {breadcrumbs.map((b) => b.label).join(' > ')}
    </div>
  ),
}));

vi.mock('@/components/PageHeader', () => ({
  PageHeader: ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children?: ReactNode;
  }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    type,
  }: {
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
  }) => (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('./components/MentorsList', () => ({
  MentorsList: () => <div data-testid="mentors-list">Mentors List Mock</div>,
}));

describe('MentorsPage Component', () => {
  it('renders header components, page title, description, and mentors list correctly', () => {
    render(<MentorsPage />);

    expect(screen.getByTestId('dashboard-header')).toHaveTextContent('Mentors');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Mentor',
    );
    expect(screen.getByText('Manage and update mentor')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /create mentor/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('icon-plus')).toBeInTheDocument();

    expect(screen.getByTestId('mentors-list')).toBeInTheDocument();
  });

  it('navigates to create form URL when Create Mentor button is clicked', async () => {
    const user = userEvent.setup();
    render(<MentorsPage />);

    const createButton = screen.getByRole('button', { name: /create mentor/i });
    await user.click(createButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('form');
  });
});
