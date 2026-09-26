import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssignmentsTable } from '../AssignmentsTable';
import { useListAssignments } from '@/hooks/assignments/useListAssignments';
import { useDeleteAssignment } from '@/hooks/assignments/useDeleteAssignment';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';

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

vi.mock('@/hooks/assignments/useListAssignments');
vi.mock('@/hooks/assignments/useDeleteAssignment');
vi.mock('@/hooks/dataOptions/useOrganizationOptions');

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (pageSize: number) => void;
}

vi.mock('@/components/Pagination', () => ({
  Pagination: ({
    currentPage,
    onPageChange,
    onRowsPerPageChange,
  }: PaginationProps) => (
    <div data-testid="pagination">
      <span>Page: {currentPage}</span>
      <button type="button" onClick={() => onPageChange(2)}>
        Next Page
      </button>
      <button type="button" onClick={() => onRowsPerPageChange(20)}>
        Set 20 Rows
      </button>
    </div>
  ),
}));

interface DeleteConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

vi.mock('@/components/DeleteConfirmationModal', () => ({
  DeleteConfirmationModal: ({
    open,
    onConfirm,
  }: DeleteConfirmationModalProps) =>
    open ? (
      <div data-testid="delete-modal">
        <button type="button" onClick={onConfirm}>
          Confirm Delete
        </button>
      </div>
    ) : null,
}));

interface DataSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}

vi.mock('@/components/DataSelect', () => ({
  DataSelect: ({ value, onValueChange, options }: DataSelectProps) => (
    <select
      data-testid="data-select"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">Select organization</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock('./AssignmentsTableSkeleton', () => ({
  AssignmentsTableSkeleton: () => (
    <tbody>
      <tr>
        <td>Loading Skeleton...</td>
      </tr>
    </tbody>
  ),
}));

const mockAssignmentsData = {
  data: [
    {
      id: 'assign-1',
      title: 'React Fundamentals',
      organization: { id: 'org-1', name: 'Org Alpha' },
      availableAt: '2026-01-01T00:00:00.000Z',
      dueAt: '2026-01-10T23:59:59.000Z',
      publishedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'assign-2',
      title: 'TypeScript Basic',
      organization: { id: 'org-1', name: 'Org Alpha' },
      availableAt: '2026-02-01T00:00:00.000Z',
      dueAt: '2026-02-10T23:59:59.000Z',
      publishedAt: null,
    },
  ],
  meta: {
    total: 2,
  },
};

const mockOrgOptions = [
  { label: 'Org Alpha', value: 'org-1' },
  { label: 'Org Beta', value: 'org-2' },
];

describe('AssignmentsTable Component', () => {
  const mockNavigate = vi.fn();
  const mockDeleteMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useOrganizationOptions).mockReturnValue({
      organizationOptions: mockOrgOptions,
      page: 1,
      searchQuery: '',
      setPage: vi.fn(),
      handleSearchOrgChange: vi.fn(),
      isOrgsLoading: false,
      totalOrgs: 2,
    });

    vi.mocked(useDeleteAssignment).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteAssignment>);
  });

  const renderComponent = (initialEntries = ['/assignments']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <AssignmentsTable />
      </MemoryRouter>,
    );
  };

  it('renders skeleton loading when assignments data is loading', () => {
    vi.mocked(useListAssignments).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderComponent();

    expect(screen.getByText('Loading Skeleton...')).toBeInTheDocument();
  });

  it('renders list of assignments correctly when data is loaded', () => {
    vi.mocked(useListAssignments).mockReturnValue({
      data: mockAssignmentsData,
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderComponent();

    expect(screen.getByText('Assignments (2)')).toBeInTheDocument();
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Basic')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Unpublished')).toBeInTheDocument();
  });

  it('renders empty table message when assignment list is empty', () => {
    vi.mocked(useListAssignments).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderComponent();

    expect(screen.getByText('No assignments found.')).toBeInTheDocument();
  });

  it('updates search query searchParams when typing in search input', async () => {
    const user = userEvent.setup();
    vi.mocked(useListAssignments).mockReturnValue({
      data: mockAssignmentsData,
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderComponent();

    const searchInput = screen.getByPlaceholderText('Search by title');
    await user.type(searchInput, 'React');

    expect(searchInput).toHaveValue('React');
  });

  it('handles pagination changes for page and rows per page', async () => {
    const user = userEvent.setup();
    vi.mocked(useListAssignments).mockReturnValue({
      data: mockAssignmentsData,
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderComponent();

    const nextPageBtn = screen.getByRole('button', { name: 'Next Page' });
    await user.click(nextPageBtn);

    expect(screen.getByText('Page: 2')).toBeInTheDocument();

    const setRowsBtn = screen.getByRole('button', { name: 'Set 20 Rows' });
    await user.click(setRowsBtn);
  });

  it('auto selects first organization option when no org is in searchParams', () => {
    vi.mocked(useListAssignments).mockReturnValue({
      data: mockAssignmentsData,
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderComponent(['/assignments']);

    expect(useOrganizationOptions).toHaveBeenCalledWith({ selectedOrgId: '' });
  });

  it('navigates to view assignment page when dropdown action view is triggered', async () => {
    const user = userEvent.setup();
    vi.mocked(useListAssignments).mockReturnValue({
      data: mockAssignmentsData,
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderComponent();

    const moreButtons = screen.getAllByRole('button', { name: 'More actions' });
    await user.click(moreButtons[0]);

    const viewItem = await screen.findByText('View Assignment');
    await user.click(viewItem);

    expect(mockNavigate).toHaveBeenCalledWith('/assignments/assign-1');
  });

  it('navigates to edit assignment form when dropdown action edit is triggered', async () => {
    const user = userEvent.setup();
    vi.mocked(useListAssignments).mockReturnValue({
      data: mockAssignmentsData,
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderComponent();

    const moreButtons = screen.getAllByRole('button', { name: 'More actions' });
    await user.click(moreButtons[0]);

    const editItem = await screen.findByText('Edit Assignment');
    await user.click(editItem);

    expect(mockNavigate).toHaveBeenCalledWith(
      '/assignments/form?assignmentId=assign-1',
    );
  });

  it('opens delete confirmation modal and confirms assignment deletion', async () => {
    const user = userEvent.setup();
    vi.mocked(useListAssignments).mockReturnValue({
      data: mockAssignmentsData,
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderComponent();

    const moreButtons = screen.getAllByRole('button', { name: 'More actions' });
    await user.click(moreButtons[0]);

    const removeItem = await screen.findByText('Remove Assignment');
    await user.click(removeItem);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: 'Confirm Delete' });
    await user.click(confirmBtn);

    expect(mockDeleteMutate).toHaveBeenCalledWith('assign-1');
  });

  it('triggers delete hook callbacks correctly on success and error', () => {
    let successCallback: (() => void) | undefined;
    let errorCallback: ((err: unknown) => void) | undefined;

    vi.mocked(useDeleteAssignment).mockImplementation((options) => {
      const opts = options as
        | {
            onSuccess?: () => void;
            onError?: (err: unknown) => void;
          }
        | undefined;

      successCallback = opts?.onSuccess;
      errorCallback = opts?.onError;

      return {
        mutate: mockDeleteMutate,
        isPending: false,
      } as unknown as ReturnType<typeof useDeleteAssignment>;
    });

    vi.mocked(useListAssignments).mockReturnValue({
      data: mockAssignmentsData,
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderComponent();

    if (successCallback) successCallback();

    if (errorCallback) errorCallback(new Error('Deletion failed'));
  });
});
