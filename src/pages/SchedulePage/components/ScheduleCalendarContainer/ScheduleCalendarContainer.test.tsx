import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ScheduleCalendarContainer } from './ScheduleCalendarContainer';
import { useListLiveSessions } from '@/hooks/liveSessions/useListLiveSessions';
import { useListAssignments } from '@/hooks/assignments/useListAssignments';
import type { LiveSession } from '@/types/liveSession';
import type { Assignment } from '@/types/assignment';

vi.mock('@/hooks/liveSessions/useListLiveSessions');
vi.mock('@/hooks/assignments/useListAssignments');

vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left" />,
  ChevronRight: () => <span data-testid="chevron-right" />,
}));

vi.mock('./ScheduleCalendarSkeleton', () => ({
  ScheduleCalendarSkeleton: () => (
    <div data-testid="calendar-skeleton">Loading Skeleton...</div>
  ),
}));

interface ScheduleCalendarProps {
  currentMonth: string | Date;
  liveSessions: LiveSession[];
  assignments: Assignment[];
}

vi.mock('../ScheduleCalendar', () => ({
  ScheduleCalendar: ({
    currentMonth,
    liveSessions,
    assignments,
  }: ScheduleCalendarProps) => (
    <div data-testid="schedule-calendar">
      <span>Calendar Month: {new Date(currentMonth).toISOString()}</span>
      <span>Live Sessions Count: {liveSessions.length}</span>
      <span>Assignments Count: {assignments.length}</span>
    </div>
  ),
}));

const mockUseListLiveSessions = vi.mocked(useListLiveSessions);
const mockUseListAssignments = vi.mocked(useListAssignments);

const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route
          path="/"
          element={<ScheduleCalendarContainer selectedOrgId="org-123" />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ScheduleCalendarContainer Component', () => {
  it('renders skeleton loading when live sessions or assignments are loading', () => {
    mockUseListLiveSessions.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useListLiveSessions>);

    mockUseListAssignments.mockReturnValue({
      data: undefined,
      isLoading: false,
    } as ReturnType<typeof useListAssignments>);

    renderWithRouter();

    expect(screen.getByTestId('calendar-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('schedule-calendar')).not.toBeInTheDocument();
  });

  it('renders calendar header and child component when data is loaded', () => {
    mockUseListLiveSessions.mockReturnValue({
      data: { data: [{ id: 'ls-1' } as LiveSession], total: 1 },
      isLoading: false,
    } as unknown as ReturnType<typeof useListLiveSessions>);

    mockUseListAssignments.mockReturnValue({
      data: { data: [{ id: 'asg-1' } as Assignment], total: 1 },
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderWithRouter();

    expect(screen.getByTestId('schedule-calendar')).toBeInTheDocument();
    expect(screen.getByText('Live Sessions Count: 1')).toBeInTheDocument();
    expect(screen.getByText('Assignments Count: 1')).toBeInTheDocument();
  });

  it('reads month query param from URL search params if present', () => {
    mockUseListLiveSessions.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    } as unknown as ReturnType<typeof useListLiveSessions>);

    mockUseListAssignments.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    const targetDate = '2026-03-01T00:00:00.000Z';
    renderWithRouter([`/?month=${encodeURIComponent(targetDate)}`]);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Mar 2026',
    );
  });

  it('disables next month button if current month in state is the current actual month', () => {
    mockUseListLiveSessions.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    } as unknown as ReturnType<typeof useListLiveSessions>);

    mockUseListAssignments.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    const nowISO = new Date().toISOString();
    renderWithRouter([`/?month=${encodeURIComponent(nowISO)}`]);

    const nextButton = screen.getByTestId('chevron-right').closest('button');
    expect(nextButton).toBeDisabled();
  });

  it('navigates to previous month when clicking previous month button', async () => {
    const user = userEvent.setup();

    mockUseListLiveSessions.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    } as unknown as ReturnType<typeof useListLiveSessions>);

    mockUseListAssignments.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderWithRouter(['/?month=2026-04-01T00:00:00.000Z']);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Apr 2026',
    );

    const prevButton = screen.getByTestId('chevron-left').closest('button')!;
    await user.click(prevButton);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Mar 2026',
    );
  });

  it('navigates to next month when clicking next month button on past months', async () => {
    const user = userEvent.setup();

    mockUseListLiveSessions.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    } as unknown as ReturnType<typeof useListLiveSessions>);

    mockUseListAssignments.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    } as unknown as ReturnType<typeof useListAssignments>);

    renderWithRouter(['/?month=2026-01-01T00:00:00.000Z']);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Jan 2026',
    );

    const nextButton = screen.getByTestId('chevron-right').closest('button')!;
    expect(nextButton).not.toBeDisabled();

    await user.click(nextButton);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Feb 2026',
    );
  });
});
