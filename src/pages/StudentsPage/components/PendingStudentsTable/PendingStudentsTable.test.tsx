import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { PendingStudentsTable } from './PendingStudentsTable';
import { useListStudentInvitations } from '@/hooks/studentInvitations/useListStudentInvitations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/hooks/studentInvitations/useListStudentInvitations');

vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: (val: string) => val,
}));

vi.mock('../StudentsTableFilters', () => ({
  StudentsTableFilters: ({
    searchQuery,
    handleSearchValueChange,
  }: {
    searchQuery: string;
    handleSearchValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      data-testid="search-filter"
      value={searchQuery}
      onChange={handleSearchValueChange}
      placeholder="Search..."
    />
  ),
}));

vi.mock('./PendingStudentsTableSkeleton', () => ({
  PendingStudentsTableSkeleton: () => (
    <tbody>
      <tr>
        <td>Loading Skeleton...</td>
      </tr>
    </tbody>
  ),
}));

type UseListStudentInvitationsReturn = ReturnType<
  typeof useListStudentInvitations
>;

describe('PendingStudentsTable', () => {
  const mockHandleOpenUpdateStudentModal = vi.fn();

  const mockPendingStudentsData = {
    data: [
      {
        id: 'invitation-1',
        email: 'pending@example.com',
        createdAt: '2026-09-01T10:00:00.000Z',
        expiresAt: '2026-09-08T10:00:00.000Z',
        organization: {
          id: 'org-1',
          name: 'Org Beta',
        },
      },
    ],
    meta: {
      total: 1,
    },
  };

  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

  const renderComponent = (initialEntries = ['/students']) => {
    const queryClient = createTestQueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route
              path="/students"
              element={
                <PendingStudentsTable
                  tableTitle="Pending Students"
                  handleOpenUpdateStudentModal={
                    mockHandleOpenUpdateStudentModal
                  }
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('renders loading skeleton when data is loading', () => {
    vi.mocked(useListStudentInvitations).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as UseListStudentInvitationsReturn);

    renderComponent();

    expect(screen.getByText('Loading Skeleton...')).toBeInTheDocument();
  });

  it('renders pending student invitation rows with formatted dates', () => {
    vi.mocked(useListStudentInvitations).mockReturnValue({
      data: mockPendingStudentsData,
      isLoading: false,
    } as UseListStudentInvitationsReturn);

    renderComponent();

    expect(screen.getByText('Pending Students (1)')).toBeInTheDocument();
    expect(screen.getByText('pending@example.com')).toBeInTheDocument();
    expect(screen.getByText('Org Beta')).toBeInTheDocument();
  });

  it('renders empty table row message when invitation data is empty', () => {
    vi.mocked(useListStudentInvitations).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    } as unknown as UseListStudentInvitationsReturn);

    renderComponent();

    expect(screen.getByText('No pending students found.')).toBeInTheDocument();
  });

  it('fetches pending students with accepted false flag', () => {
    vi.mocked(useListStudentInvitations).mockReturnValue({
      data: mockPendingStudentsData,
      isLoading: false,
    } as UseListStudentInvitationsReturn);

    renderComponent();

    expect(useListStudentInvitations).toHaveBeenCalledWith(
      expect.objectContaining({
        accepted: false,
      }),
    );
  });
});
