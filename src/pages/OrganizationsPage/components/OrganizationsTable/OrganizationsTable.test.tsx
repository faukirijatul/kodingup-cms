import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrganizationsTable } from './OrganizationsTable';
import { useListOrganizations } from '@/hooks/organizations/useListOrganizations';
import { useDeleteOrganization } from '@/hooks/organizations/useDeleteOrganization';
import { toast } from 'sonner';

vi.mock('@/hooks/organizations/useListOrganizations');
vi.mock('@/hooks/organizations/useDeleteOrganization');
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../CreateOrganizationModal', () => ({
  CreateOrganizationModal: ({
    selectedOrganizationId,
  }: {
    selectedOrganizationId: string;
  }) => (
    <div data-testid="create-organization-modal">
      Modal - ID: {selectedOrganizationId}
    </div>
  ),
}));

const mockOrganizationsData = {
  data: [
    {
      id: 'org-1',
      name: 'Acme Corporation',
      createdAt: '2026-01-15T00:00:00.000Z',
    },
    {
      id: 'org-2',
      name: 'Stark Industries',
      createdAt: '2026-02-20T00:00:00.000Z',
    },
  ],
  meta: {
    total: 2,
  },
};

describe('OrganizationsTable', () => {
  let queryClient: QueryClient;
  const mockOnOpenChange = vi.fn();
  const mockSetSelectedOrganizationId = vi.fn();

  const createWrapper = (initialEntries = ['/organizations']) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    (
      useListOrganizations as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: mockOrganizationsData,
      isLoading: false,
    });
    (
      useDeleteOrganization as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders skeleton rows when loading organizations', () => {
    (
      useListOrganizations as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(
      <OrganizationsTable
        open={false}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
        setSelectedOrganizationId={mockSetSelectedOrganizationId}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Organizations (0)')).toBeInTheDocument();
    expect(screen.queryByText('Acme Corporation')).not.toBeInTheDocument();
  });

  it('renders list of organizations correctly with formatted dates', () => {
    render(
      <OrganizationsTable
        open={false}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
        setSelectedOrganizationId={mockSetSelectedOrganizationId}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Organizations (2)')).toBeInTheDocument();
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    expect(screen.getByText('Stark Industries')).toBeInTheDocument();
    expect(screen.getByText('Thu, Jan 15, 2026')).toBeInTheDocument();
    expect(screen.getByText('Fri, Feb 20, 2026')).toBeInTheDocument();
  });

  it('renders empty table row when organization list is empty', () => {
    (
      useListOrganizations as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    });

    render(
      <OrganizationsTable
        open={false}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
        setSelectedOrganizationId={mockSetSelectedOrganizationId}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('No organizations found.')).toBeInTheDocument();
  });

  it('updates search query when user types in search input', async () => {
    const user = userEvent.setup();

    render(
      <OrganizationsTable
        open={false}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
        setSelectedOrganizationId={mockSetSelectedOrganizationId}
      />,
      { wrapper: createWrapper() },
    );

    const searchInput = screen.getByPlaceholderText('Search by name');
    await user.type(searchInput, 'Acme');

    expect(searchInput).toHaveValue('Acme');
    expect(useListOrganizations).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'Acme',
      }),
    );
  });

  it('triggers setSelectedOrganizationId and onOpenChange when choosing Edit Organization', async () => {
    const user = userEvent.setup();

    render(
      <OrganizationsTable
        open={false}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
        setSelectedOrganizationId={mockSetSelectedOrganizationId}
      />,
      { wrapper: createWrapper() },
    );

    const actionButtons = screen.getAllByRole('button', {
      name: /more actions/i,
    });
    await user.click(actionButtons[0]);

    const editItem = await screen.findByText('Edit Organization');
    await user.click(editItem);

    expect(mockSetSelectedOrganizationId).toHaveBeenCalledWith('org-1');
    expect(mockOnOpenChange).toHaveBeenCalledWith(true);
  });

  it('opens delete modal and triggers deleteOrganization mutation when confirmed', async () => {
    const user = userEvent.setup();
    const mockDelete = vi.fn();

    (
      useDeleteOrganization as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      mutate: mockDelete,
      isPending: false,
    });

    render(
      <OrganizationsTable
        open={false}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
        setSelectedOrganizationId={mockSetSelectedOrganizationId}
      />,
      { wrapper: createWrapper() },
    );

    const actionButtons = screen.getAllByRole('button', {
      name: /more actions/i,
    });
    await user.click(actionButtons[0]);

    const removeItem = await screen.findByText('Remove Organization');
    await user.click(removeItem);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Delete Organization')).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole('button', {
      name: /^delete$/i,
    });
    await user.click(confirmButton);

    expect(mockDelete).toHaveBeenCalledWith('org-1');
  });

  it('handles delete organization onSuccess callback correctly', () => {
    let onSuccessCallback: () => void = () => {};

    (
      useDeleteOrganization as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(({ onSuccess }) => {
      onSuccessCallback = onSuccess;
      return { mutate: vi.fn(), isPending: false };
    });

    render(
      <OrganizationsTable
        open={false}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
        setSelectedOrganizationId={mockSetSelectedOrganizationId}
      />,
      { wrapper: createWrapper() },
    );

    onSuccessCallback();

    expect(toast.success).toHaveBeenCalledWith(
      'Organization deleted successfully',
    );
  });

  it('handles delete organization onError callback correctly', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let onErrorCallback: (error: Error) => void = () => {};

    (
      useDeleteOrganization as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(({ onError }) => {
      onErrorCallback = onError;
      return { mutate: vi.fn(), isPending: false };
    });

    render(
      <OrganizationsTable
        open={false}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId=""
        setSelectedOrganizationId={mockSetSelectedOrganizationId}
      />,
      { wrapper: createWrapper() },
    );

    onErrorCallback(new Error('Delete error'));

    expect(toast.error).toHaveBeenCalledWith('Failed to delete organization');
  });

  it('renders CreateOrganizationModal when open prop is true', () => {
    render(
      <OrganizationsTable
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedOrganizationId="org-123"
        setSelectedOrganizationId={mockSetSelectedOrganizationId}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByTestId('create-organization-modal')).toBeInTheDocument();
    expect(screen.getByText('Modal - ID: org-123')).toBeInTheDocument();
  });
});
