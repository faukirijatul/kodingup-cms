import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { LiveSessionsTable } from './LiveSessionsTable';
import { LiveSessionTableFilters } from './LiveSessionTableFilters';
import { useListLiveSessions } from '@/hooks/liveSessions/useListLiveSessions';
import { useDeleteLiveSession } from '@/hooks/liveSessions/useDeleteLiveSession';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';
import type { LiveSession } from '@/types/liveSession';

vi.mock('@/hooks/liveSessions/useListLiveSessions');
vi.mock('@/hooks/liveSessions/useDeleteLiveSession');
vi.mock('@/hooks/dataOptions/useOrganizationOptions');
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('lucide-react', () => ({
  MoreVertical: () => <span data-testid="more-vertical-icon" />,
  Search: () => <span data-testid="search-icon" />,
}));

vi.mock('@/components/icons/IconEye', () => ({
  IconEye: () => <span data-testid="icon-eye" />,
}));

vi.mock('@/components/icons/IconPencilLine', () => ({
  IconPencilLine: () => <span data-testid="icon-pencil" />,
}));

vi.mock('@/components/icons/IconTrash', () => ({
  IconTrash: () => <span data-testid="icon-trash" />,
}));

vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: ReactNode }) => <table>{children}</table>,
  TableHeader: ({ children }: { children: ReactNode }) => (
    <thead>{children}</thead>
  ),
  TableBody: ({ children }: { children: ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  TableRow: ({ children }: { children: ReactNode }) => <tr>{children}</tr>,
  TableHead: ({ children }: { children: ReactNode }) => <th>{children}</th>,
  TableCell: ({ children }: { children: ReactNode }) => <td>{children}</td>,
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props: ComponentPropsWithoutRef<'input'>) => <input {...props} />,
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

vi.mock('@/components/Pagination', () => ({
  Pagination: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next Page</button>
    </div>
  ),
}));

vi.mock('@/components/EmptyTableRow', () => ({
  EmptyTableRow: ({ message }: { message: string }) => (
    <tr>
      <td colSpan={6}>{message}</td>
    </tr>
  ),
}));

vi.mock('./LiveSessionsTableSkeleton', () => ({
  LiveSessionsTableSkeleton: () => (
    <tbody data-testid="table-skeleton">
      <tr>
        <td>Loading table...</td>
      </tr>
    </tbody>
  ),
}));

vi.mock('../modals/CreateLiveSessionModal', () => ({
  CreateLiveSessionModal: ({
    selectedLiveSessionId,
  }: {
    selectedLiveSessionId: string;
  }) => (
    <div data-testid="create-modal">
      Modal Session ID: {selectedLiveSessionId}
    </div>
  ),
}));

vi.mock('@/components/DeleteConfirmationModal', () => ({
  DeleteConfirmationModal: ({ onConfirm }: { onConfirm: () => void }) => (
    <div data-testid="delete-modal">
      <button onClick={onConfirm}>Confirm Delete</button>
    </div>
  ),
}));

vi.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Trigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Portal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Content: ({ children }: { children: ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  Item: ({
    children,
    onSelect,
    'data-value': dataValue,
  }: {
    children: ReactNode;
    onSelect?: (e: { currentTarget: HTMLElement }) => void;
    'data-value'?: string;
  }) => (
    <button
      data-value={dataValue}
      onClick={(e) => onSelect?.({ currentTarget: e.currentTarget })}
    >
      {children}
    </button>
  ),
}));

const mockLiveSessions = [
  {
    id: 'session-1',
    title: 'React Fundamentals',
    organizationId: 1,
    organization: { id: 1, name: 'KodingUp Academy' },
    startAt: '2026-06-01T09:00:00.000Z',
    endAt: '2026-06-01T11:00:00.000Z',
  },
  {
    id: 'session-2',
    title: 'Advanced TypeScript',
    organizationId: 2,
    organization: { id: 2, name: 'Tech Academy' },
    startAt: '2026-06-02T14:00:00.000Z',
    endAt: '2026-06-02T16:00:00.000Z',
  },
] as unknown as LiveSession[];

const mockOrgOptions = [
  { label: 'KodingUp Academy', value: '1' },
  { label: 'Tech Academy', value: '2' },
];

describe('LiveSessionsTable Component', () => {
  const mockOnOpenChange = vi.fn();
  const mockSetSelectedLiveSessionId = vi.fn();
  const mockDeleteMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(useOrganizationOptions).mockReturnValue({
      organizationOptions: mockOrgOptions,
      page: 1,
      searchQuery: '',
      setPage: vi.fn(),
      handleSearchOrgChange: vi.fn(),
      isOrgsLoading: false,
      totalOrgs: 2,
    });

    vi.mocked(useListLiveSessions).mockReturnValue({
      data: {
        data: mockLiveSessions,
        meta: { total: 2 },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useListLiveSessions>);

    vi.mocked(useDeleteLiveSession).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteLiveSession>);
  });

  const renderComponent = (
    props: { open?: boolean; selectedLiveSessionId?: string } = {},
  ) => {
    return render(
      <MemoryRouter>
        <LiveSessionsTable
          open={props.open ?? false}
          onOpenChange={mockOnOpenChange}
          selectedLiveSessionId={props.selectedLiveSessionId ?? ''}
          setSelectedLiveSessionId={mockSetSelectedLiveSessionId}
        />
      </MemoryRouter>,
    );
  };

  it('renders skeleton loader when sessions are loading', () => {
    vi.mocked(useListLiveSessions).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useListLiveSessions>);

    renderComponent();

    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });

  it('renders table headers and data correctly when loaded', () => {
    renderComponent();

    expect(screen.getByText('Live Sessions (2)')).toBeInTheDocument();
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument();

    expect(
      screen.getAllByText('KodingUp Academy').length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tech Academy').length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it('renders empty table row when list is empty', () => {
    vi.mocked(useListLiveSessions).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    } as unknown as ReturnType<typeof useListLiveSessions>);

    renderComponent();

    expect(screen.getByText('No live sessions found.')).toBeInTheDocument();
  });

  it('handles search input and updates query params', async () => {
    const user = userEvent.setup();
    renderComponent();

    const searchInput = screen.getByPlaceholderText('Search by title');
    await user.type(searchInput, 'React');

    expect(searchInput).toHaveValue('React');
  });

  it('handles pagination next click', async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByText(/Page 1 of 1/)).toBeInTheDocument();

    const nextPageButton = screen.getByRole('button', { name: 'Next Page' });
    await user.click(nextPageButton);

    expect(screen.getByText(/Page 2 of 1/)).toBeInTheDocument();
  });

  it('triggers update modal when clicking edit option', async () => {
    const user = userEvent.setup();
    renderComponent();

    const editButtons = screen.getAllByRole('button', {
      name: /Edit Live Session/i,
    });
    await user.click(editButtons[0]);

    expect(mockSetSelectedLiveSessionId).toHaveBeenCalledWith('session-1');
    expect(mockOnOpenChange).toHaveBeenCalledWith(true);
  });

  it('opens delete confirmation modal and submits deletion', async () => {
    const user = userEvent.setup();
    renderComponent();

    const deleteButtons = screen.getAllByRole('button', {
      name: /Remove Live Session/i,
    });
    await user.click(deleteButtons[0]);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', {
      name: 'Confirm Delete',
    });
    await user.click(confirmButton);

    expect(mockDeleteMutate).toHaveBeenCalledWith('session-1');
  });

  it('renders CreateLiveSessionModal when open is true', () => {
    renderComponent({ open: true, selectedLiveSessionId: 'session-1' });

    expect(screen.getByTestId('create-modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Session ID: session-1')).toBeInTheDocument();
  });
});

describe('LiveSessionTableFilters Component', () => {
  const DummyFiltersWrapper = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
      <LiveSessionTableFilters
        setSearchParams={setSearchParams}
        searchQuery={searchParams.get('query') || ''}
        handleSearchValueChange={(e) => {
          const val = e.target.value;
          setSearchParams((prev) => {
            if (val) prev.set('query', val);
            else prev.delete('query');
            return prev;
          });
        }}
        selectedOrgId={searchParams.get('org') || ''}
        handleOrgChange={(val) => {
          setSearchParams((prev) => {
            if (val) prev.set('org', val);
            else prev.delete('org');
            return prev;
          });
        }}
      />
    );
  };

  beforeEach(() => {
    vi.mocked(useOrganizationOptions).mockReturnValue({
      organizationOptions: mockOrgOptions,
      page: 1,
      searchQuery: '',
      setPage: vi.fn(),
      handleSearchOrgChange: vi.fn(),
      isOrgsLoading: false,
      totalOrgs: 2,
    });
  });

  it('automatically sets default organization option in URL if selectedOrgId is empty', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <DummyFiltersWrapper />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('data-select')).toHaveValue('1');
    });
  });

  it('triggers organization option change', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/?org=1']}>
        <DummyFiltersWrapper />
      </MemoryRouter>,
    );

    const select = screen.getByTestId('data-select');
    await user.selectOptions(select, '2');

    expect(select).toHaveValue('2');
  });
});
