import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { STUDENT_STATUS } from '@/constants/student';
import { StudentsTable } from './StudentsTable';

vi.mock('../EnrolledStudentsTable', () => ({
  EnrolledStudentsTable: ({
    tableTitle,
    handleOpenDetailProfileModal,
    handleOpenUpdateStudentModal,
  }: {
    tableTitle: string;
    handleOpenDetailProfileModal: (event: Event) => void;
    handleOpenUpdateStudentModal: (event: Event) => void;
  }) => (
    <div data-testid="enrolled-table">
      <span>{tableTitle}</span>
      <button
        type="button"
        data-testid="btn-detail-profile"
        onClick={() => {
          const fakeEvent = {
            currentTarget: { dataset: { value: 'student-123' } },
          } as unknown as Event;
          handleOpenDetailProfileModal(fakeEvent);
        }}
      >
        Open Detail Profile
      </button>
      <button
        type="button"
        data-testid="btn-update-status"
        onClick={() => {
          const fakeEvent = {
            currentTarget: { dataset: { value: 'student-123' } },
          } as unknown as Event;
          handleOpenUpdateStudentModal(fakeEvent);
        }}
      >
        Open Update Status
      </button>
    </div>
  ),
}));

vi.mock('../PendingStudentsTable', () => ({
  PendingStudentsTable: ({ tableTitle }: { tableTitle: string }) => (
    <div data-testid="pending-table">
      <span>{tableTitle}</span>
    </div>
  ),
}));

vi.mock('../modals/DetailProfileStudentModal', () => ({
  DetailProfileStudentModal: ({
    open,
    selectedStudentId,
  }: {
    open: boolean;
    selectedStudentId: string;
  }) =>
    open ? (
      <div data-testid="detail-profile-modal">
        Detail Profile Modal for {selectedStudentId}
      </div>
    ) : null,
}));

vi.mock('../modals/UpdateStudentStatusModal', () => ({
  UpdateStudentStatusModal: ({ open }: { open: boolean }) =>
    open ? (
      <div data-testid="update-status-modal">Update Status Modal</div>
    ) : null,
}));

describe('StudentsTable', () => {
  it('renders EnrolledStudentsTable with "Students" title when status is ENROLLED', () => {
    render(<StudentsTable selectedStatus={STUDENT_STATUS.ENROLLED} />);

    expect(screen.getByTestId('enrolled-table')).toBeInTheDocument();
    expect(screen.queryByTestId('pending-table')).not.toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
  });

  it('renders PendingStudentsTable with "Pending Invitations" title when status is not ENROLLED', () => {
    render(<StudentsTable selectedStatus={STUDENT_STATUS.PENDING} />);

    expect(screen.getByTestId('pending-table')).toBeInTheDocument();
    expect(screen.queryByTestId('enrolled-table')).not.toBeInTheDocument();
    expect(screen.getByText('Pending Invitations')).toBeInTheDocument();
  });

  it('opens DetailProfileStudentModal with selected student ID when triggered', async () => {
    const user = userEvent.setup();
    render(<StudentsTable selectedStatus={STUDENT_STATUS.ENROLLED} />);

    expect(
      screen.queryByTestId('detail-profile-modal'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId('btn-detail-profile'));

    expect(screen.getByTestId('detail-profile-modal')).toBeInTheDocument();
    expect(
      screen.getByText('Detail Profile Modal for student-123'),
    ).toBeInTheDocument();
  });

  it('opens UpdateStudentStatusModal when triggered', async () => {
    const user = userEvent.setup();
    render(<StudentsTable selectedStatus={STUDENT_STATUS.ENROLLED} />);

    expect(screen.queryByTestId('update-status-modal')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('btn-update-status'));

    expect(screen.getByTestId('update-status-modal')).toBeInTheDocument();
  });
});
