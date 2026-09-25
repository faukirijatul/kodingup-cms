import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { EnrolledStudentsTable } from './EnrolledStudentsTable';
import { useListStudents } from '@/hooks/students/useListStudents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/hooks/students/useListStudents');

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

vi.mock('./EnrolledStudentsTableSkeleton', () => ({
  EnrolledStudentsTableSkeleton: () => (
    <tbody>
      <tr>
        <td>Loading Skeleton...</td>
      </tr>
    </tbody>
  ),
}));

type UseListStudentsReturn = ReturnType<typeof useListStudents>;

describe('EnrolledStudentsTable', () => {
  const mockHandleOpenDetailProfileModal = vi.fn();
  const mockHandleOpenUpdateStudentModal = vi.fn();

  const mockEnrolledStudentsData = {
    data: [
      {
        id: 'student-1',
        code: 'STD-001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        profileUrl: 'https://example.com/john.jpg',
        organization: {
          id: 'org-1',
          name: 'Org Alpha',
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
                <EnrolledStudentsTable
                  tableTitle="Enrolled Students"
                  handleOpenDetailProfileModal={
                    mockHandleOpenDetailProfileModal
                  }
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
    vi.mocked(useListStudents).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as UseListStudentsReturn);

    renderComponent();

    expect(screen.getByText('Loading Skeleton...')).toBeInTheDocument();
  });

  it('renders student rows and table title with correct count', () => {
    vi.mocked(useListStudents).mockReturnValue({
      data: mockEnrolledStudentsData,
      isLoading: false,
    } as UseListStudentsReturn);

    renderComponent();

    expect(screen.getByText('Enrolled Students (1)')).toBeInTheDocument();
    expect(screen.getByText('STD-001')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Org Alpha')).toBeInTheDocument();
  });

  it('renders empty table row message when data array is empty', () => {
    vi.mocked(useListStudents).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    } as unknown as UseListStudentsReturn);

    renderComponent();

    expect(screen.getByText('No enrolled students found.')).toBeInTheDocument();
  });

  it('updates searchParam query on search input change', async () => {
    vi.mocked(useListStudents).mockReturnValue({
      data: mockEnrolledStudentsData,
      isLoading: false,
    } as UseListStudentsReturn);

    const user = userEvent.setup();
    renderComponent();

    const searchInput = screen.getByTestId('search-filter');
    await user.type(searchInput, 'John');

    expect(useListStudents).toHaveBeenLastCalledWith(
      expect.objectContaining({
        query: 'John',
      }),
    );
  });
});
