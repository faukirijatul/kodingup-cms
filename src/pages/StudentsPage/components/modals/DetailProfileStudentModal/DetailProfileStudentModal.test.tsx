import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DetailProfileStudentModal } from './DetailProfileStudentModal';
import { useGetStudent } from '@/hooks/students/useGetStudent';
import { useGetOrganization } from '@/hooks/organizations/useGetOrganization';
import { useGetStudentAttendances } from '@/hooks/students/useGetStudentAttendances';

vi.mock('@/hooks/students/useGetStudent');
vi.mock('@/hooks/organizations/useGetOrganization');
vi.mock('@/hooks/students/useGetStudentAttendances');

type UseGetStudentReturn = ReturnType<typeof useGetStudent>;
type UseGetOrganizationReturn = ReturnType<typeof useGetOrganization>;
type UseGetStudentAttendancesReturn = ReturnType<
  typeof useGetStudentAttendances
>;

describe('DetailProfileStudentModal', () => {
  const mockOnOpenChange = vi.fn();
  const selectedStudentId = 'student-123';

  const mockStudentData = {
    data: {
      id: selectedStudentId,
      firstName: 'John',
      lastName: 'Doe',
      profileUrl: 'https://example.com/avatar.jpg',
      code: 'STD-001',
      organizationId: 'org-1',
      createdAt: '2026-01-15T00:00:00.000Z',
    },
  };

  const mockOrganizationData = {
    data: {
      id: 'org-1',
      name: 'KodingUp Academy',
    },
  };

  const mockAttendancesData = {
    data: [
      {
        id: 'att-1',
        studentId: selectedStudentId,
        firstJoinedAt: '2026-09-01T08:00:00.000Z',
        duration: 3600,
      },
    ],
  };

  it('does not render dialog content when open is false', () => {
    vi.mocked(useGetStudent).mockReturnValue({
      data: mockStudentData,
      isLoading: false,
    } as UseGetStudentReturn);
    vi.mocked(useGetOrganization).mockReturnValue({
      data: mockOrganizationData,
      isLoading: false,
    } as UseGetOrganizationReturn);
    vi.mocked(useGetStudentAttendances).mockReturnValue({
      data: mockAttendancesData,
      isLoading: false,
    } as UseGetStudentAttendancesReturn);

    render(
      <DetailProfileStudentModal
        open={false}
        onOpenChange={mockOnOpenChange}
        selectedStudentId={selectedStudentId}
      />,
    );

    expect(
      screen.queryByText('Course Calendar & Session Logs'),
    ).not.toBeInTheDocument();
  });

  it('renders loading skeleton when student or organization data is loading', () => {
    vi.mocked(useGetStudent).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as UseGetStudentReturn);
    vi.mocked(useGetOrganization).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as UseGetOrganizationReturn);
    vi.mocked(useGetStudentAttendances).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as UseGetStudentAttendancesReturn);

    render(
      <DetailProfileStudentModal
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedStudentId={selectedStudentId}
      />,
    );

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders student profile details and organization name when loaded', () => {
    vi.mocked(useGetStudent).mockReturnValue({
      data: mockStudentData,
      isLoading: false,
    } as UseGetStudentReturn);
    vi.mocked(useGetOrganization).mockReturnValue({
      data: mockOrganizationData,
      isLoading: false,
    } as UseGetOrganizationReturn);
    vi.mocked(useGetStudentAttendances).mockReturnValue({
      data: mockAttendancesData,
      isLoading: false,
    } as UseGetStudentAttendancesReturn);

    render(
      <DetailProfileStudentModal
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedStudentId={selectedStudentId}
      />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('STD-001')).toBeInTheDocument();
    expect(screen.getByText('KodingUp Academy')).toBeInTheDocument();
    expect(screen.getByText('Enrolled At 2026-01-15')).toBeInTheDocument();
  });
});
