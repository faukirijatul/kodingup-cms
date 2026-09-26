import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { LiveSessionsPage } from './LiveSessionsPage';

vi.mock('lucide-react', () => ({
  Plus: () => <span data-testid="plus-icon" />,
}));

interface DashboardHeaderProps {
  breadcrumbs: Array<{ label: string }>;
}

vi.mock('@/components/DashboardHeader', () => ({
  DashboardHeader: ({ breadcrumbs }: DashboardHeaderProps) => (
    <div data-testid="dashboard-header">
      {breadcrumbs.map((b) => b.label).join(' > ')}
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

interface LiveSessionsTableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLiveSessionId: string;
  setSelectedLiveSessionId: (id: string) => void;
}

vi.mock('./components/LiveSessionsTable', () => ({
  LiveSessionsTable: ({
    open,
    onOpenChange,
    selectedLiveSessionId,
    setSelectedLiveSessionId,
  }: LiveSessionsTableProps) => (
    <div data-testid="live-sessions-table">
      <span>Table Open Status: {open ? 'Open' : 'Closed'}</span>
      <span>Selected Session ID: {selectedLiveSessionId || 'None'}</span>
      <button
        type="button"
        onClick={() => {
          setSelectedLiveSessionId('session-123');
          onOpenChange(true);
        }}
      >
        Trigger Edit Session
      </button>
      <button type="button" onClick={() => onOpenChange(false)}>
        Close Modal via Table
      </button>
    </div>
  ),
}));

interface CreateLiveSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLiveSessionId: string;
}

vi.mock('./components/modals/CreateLiveSessionModal', () => ({
  CreateLiveSessionModal: ({
    open,
    onOpenChange,
    selectedLiveSessionId,
  }: CreateLiveSessionModalProps) => (
    <div data-testid="create-live-session-modal">
      <span>Modal Open: {open ? 'Yes' : 'No'}</span>
      <span>Modal Session ID: {selectedLiveSessionId || 'New'}</span>
      <button type="button" onClick={() => onOpenChange(false)}>
        Close Modal Inner
      </button>
    </div>
  ),
}));

describe('LiveSessionsPage Component', () => {
  it('renders header, breadcrumbs, title, and create button correctly', () => {
    render(<LiveSessionsPage />);

    expect(screen.getByTestId('dashboard-header')).toHaveTextContent(
      'Live Sessions',
    );
    expect(
      screen.getByRole('heading', { name: 'Live Sessions' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Manage and update live sessions'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create Live Session/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('live-sessions-table')).toBeInTheDocument();
    expect(
      screen.queryByTestId('create-live-session-modal'),
    ).not.toBeInTheDocument();
  });

  it('opens modal in create mode when clicking "Create Live Session" button', async () => {
    const user = userEvent.setup();
    render(<LiveSessionsPage />);

    const createButton = screen.getByRole('button', {
      name: /Create Live Session/i,
    });
    await user.click(createButton);

    expect(screen.getByTestId('create-live-session-modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Session ID: New')).toBeInTheDocument();
  });

  it('handles edit action from table, passing selected live session ID to modal', async () => {
    const user = userEvent.setup();
    render(<LiveSessionsPage />);

    const triggerEditButton = screen.getByRole('button', {
      name: 'Trigger Edit Session',
    });
    await user.click(triggerEditButton);

    expect(screen.getByTestId('create-live-session-modal')).toBeInTheDocument();
    expect(
      screen.getByText('Modal Session ID: session-123'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Selected Session ID: session-123'),
    ).toBeInTheDocument();
  });

  it('resets selectedLiveSessionId to empty string when closing modal', async () => {
    const user = userEvent.setup();
    render(<LiveSessionsPage />);

    const triggerEditButton = screen.getByRole('button', {
      name: 'Trigger Edit Session',
    });
    await user.click(triggerEditButton);
    expect(
      screen.getByText('Modal Session ID: session-123'),
    ).toBeInTheDocument();

    const closeModalButton = screen.getByRole('button', {
      name: 'Close Modal Inner',
    });
    await user.click(closeModalButton);

    expect(
      screen.queryByTestId('create-live-session-modal'),
    ).not.toBeInTheDocument();

    const createButton = screen.getByRole('button', {
      name: /Create Live Session/i,
    });
    await user.click(createButton);

    expect(screen.getByText('Modal Session ID: New')).toBeInTheDocument();
    expect(screen.getByText('Selected Session ID: None')).toBeInTheDocument();
  });
});
