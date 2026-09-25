import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { OrganizationsPage } from './OrganizationsPage';

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

vi.mock('./components/OrganizationsTable', () => ({
  OrganizationsTable: ({
    open,
    selectedOrganizationId,
    setSelectedOrganizationId,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedOrganizationId: string;
    setSelectedOrganizationId: (id: string) => void;
  }) => (
    <div data-testid="organizations-table">
      <span data-testid="table-open-state">{open ? 'open' : 'closed'}</span>
      <span data-testid="table-selected-id">{selectedOrganizationId}</span>
      <button
        data-testid="select-organization-button"
        onClick={() => setSelectedOrganizationId('org-123')}
      >
        Select Organization
      </button>
    </div>
  ),
}));

vi.mock('./components/CreateOrganizationModal', () => ({
  CreateOrganizationModal: ({
    open,
    onOpenChange,
    selectedOrganizationId,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedOrganizationId: string;
  }) => (
    <div data-testid="create-organization-modal">
      <span>Modal Open: {open ? 'yes' : 'no'}</span>
      <span data-testid="modal-selected-id">
        Selected: {selectedOrganizationId}
      </span>
      <button
        data-testid="close-modal-button"
        onClick={() => onOpenChange(false)}
      >
        Close Modal
      </button>
    </div>
  ),
}));

describe('OrganizationsPage', () => {
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

  it('renders page layout, header, and organizations table correctly', () => {
    render(<OrganizationsPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-item')).toHaveTextContent(
      'Organizations',
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Organization' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Manage and update organization'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create organization/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('organizations-table')).toBeInTheDocument();
    expect(
      screen.queryByTestId('create-organization-modal'),
    ).not.toBeInTheDocument();
  });

  it('opens CreateOrganizationModal when clicking Create Organization button', async () => {
    const user = userEvent.setup();
    render(<OrganizationsPage />, { wrapper: createWrapper() });

    const createButton = screen.getByRole('button', {
      name: /create organization/i,
    });
    await user.click(createButton);

    expect(screen.getByTestId('create-organization-modal')).toBeInTheDocument();
    expect(screen.getByTestId('table-open-state')).toHaveTextContent('open');
  });

  it('clears selectedOrganizationId and closes modal when handleOpenChange is triggered with false', async () => {
    const user = userEvent.setup();
    render(<OrganizationsPage />, { wrapper: createWrapper() });

    const selectOrgButton = screen.getByTestId('select-organization-button');
    await user.click(selectOrgButton);
    expect(screen.getByTestId('table-selected-id')).toHaveTextContent(
      'org-123',
    );

    const createButton = screen.getByRole('button', {
      name: /create organization/i,
    });
    await user.click(createButton);

    expect(screen.getByTestId('modal-selected-id')).toHaveTextContent(
      'Selected: org-123',
    );

    const closeModalButton = screen.getByTestId('close-modal-button');
    await user.click(closeModalButton);

    expect(
      screen.queryByTestId('create-organization-modal'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('table-selected-id')).toHaveTextContent('');
  });
});
