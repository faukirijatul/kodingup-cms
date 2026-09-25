import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { STUDENT_STATUS } from '@/constants/student';
import { StudentsPage } from './StudentsPage';

vi.mock('./components/StudentsTable', () => ({
  StudentsTable: ({ selectedStatus }: { selectedStatus: number }) => (
    <div data-testid="students-table">Table Status: {selectedStatus}</div>
  ),
}));

vi.mock('./components/modals/InviteStudentModal', () => ({
  InviteStudentModal: ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div data-testid="invite-student-modal">
        <button type="button" onClick={() => onOpenChange(false)}>
          Close Modal
        </button>
      </div>
    ) : null,
}));

describe('StudentsPage', () => {
  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  const renderWithRouter = (initialEntries = ['/students']) => {
    const queryClient = createTestQueryClient();

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/students" element={<StudentsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  describe('URL SearchParams & Initial Render', () => {
    it('sets default status to ENROLLED in URL search params if missing', () => {
      renderWithRouter(['/students']);

      expect(screen.getByTestId('students-table')).toHaveTextContent(
        `Table Status: ${STUDENT_STATUS.ENROLLED}`,
      );
      expect(
        screen.getByRole('button', { name: 'Enrolled' }),
      ).toBeInTheDocument();
    });

    it('respects existing status from search params on load', () => {
      renderWithRouter([`/students?status=${STUDENT_STATUS.PENDING}`]);

      expect(screen.getByTestId('students-table')).toHaveTextContent(
        `Table Status: ${STUDENT_STATUS.PENDING}`,
      );
      expect(
        screen.getByRole('button', { name: 'Pending' }),
      ).toBeInTheDocument();
    });

    it('renders page header title and description correctly', () => {
      renderWithRouter();

      expect(
        screen.getByRole('heading', { name: 'Students', level: 1 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Track student progress and update student profiles'),
      ).toBeInTheDocument();
    });
  });

  describe('Tab Selection & Navigation', () => {
    it('updates status and table when clicking another status segment', async () => {
      const user = userEvent.setup();
      renderWithRouter([`/students?status=${STUDENT_STATUS.ENROLLED}`]);

      const pendingTab = screen.getByRole('button', { name: 'Pending' });
      await user.click(pendingTab);

      expect(screen.getByTestId('students-table')).toHaveTextContent(
        `Table Status: ${STUDENT_STATUS.PENDING}`,
      );
    });
  });

  describe('Invite Student Modal Flow', () => {
    it('does not render InviteStudentModal initially', () => {
      renderWithRouter();

      expect(
        screen.queryByTestId('invite-student-modal'),
      ).not.toBeInTheDocument();
    });

    it('opens and closes InviteStudentModal when triggered', async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const inviteButton = screen.getByRole('button', {
        name: /invite student/i,
      });
      await user.click(inviteButton);

      expect(screen.getByTestId('invite-student-modal')).toBeInTheDocument();

      const closeModalButton = screen.getByRole('button', {
        name: 'Close Modal',
      });
      await user.click(closeModalButton);

      expect(
        screen.queryByTestId('invite-student-modal'),
      ).not.toBeInTheDocument();
    });
  });
});
