import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ScheduleCalendar } from './ScheduleCalendar';
import type { LiveSession } from '@/types/liveSession';
import type { Assignment } from '@/types/assignment';
import type { DayEvents } from '@/types/schedule';

vi.mock('@/constants/calendar', () => ({
  WEEKDAYS_START_FROM_MONDAY: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}));

interface DayEventsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: DayEvents;
}

vi.mock('../DayEventsModal', () => ({
  DayEventsModal: ({ open, events, onOpenChange }: DayEventsModalProps) =>
    open ? (
      <div data-testid="day-events-modal">
        <span>Modal Opened</span>
        <span>Sessions Count: {events.liveSessions.length}</span>
        <span>Assignments Count: {events.assignments.length}</span>
        <button type="button" onClick={() => onOpenChange(false)}>
          Close Modal
        </button>
      </div>
    ) : null,
}));

const mockCurrentMonth = '2026-06-01T00:00:00.000Z';

const mockLiveSessions: LiveSession[] = [
  {
    id: 'ls-1',
    title: 'React Live Session',
    startAt: '2026-06-15T10:00:00.000Z',
  } as unknown as LiveSession,
];

const mockAssignments: Assignment[] = [
  {
    id: 'asg-1',
    title: 'TypeScript Assignment',
    availableAt: '2026-06-15T08:00:00.000Z',
  } as unknown as Assignment,
];

describe('ScheduleCalendar Component', () => {
  it('renders weekday headers correctly', () => {
    render(
      <ScheduleCalendar
        currentMonth={mockCurrentMonth}
        liveSessions={[]}
        assignments={[]}
      />,
    );

    const headers = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('renders days of the month grid and legends', () => {
    render(
      <ScheduleCalendar
        currentMonth={mockCurrentMonth}
        liveSessions={[]}
        assignments={[]}
      />,
    );

    const dayOnes = screen.getAllByText('1');
    expect(dayOnes.length).toBeGreaterThanOrEqual(1);
    expect(dayOnes[0]).toBeInTheDocument();

    expect(screen.getByText('30')).toBeInTheDocument();

    expect(screen.getByText('Live Session')).toBeInTheDocument();
    expect(screen.getByText('Assignment')).toBeInTheDocument();
  });

  it('renders event indicators for dates with live sessions and assignments', () => {
    const { container } = render(
      <ScheduleCalendar
        currentMonth={mockCurrentMonth}
        liveSessions={mockLiveSessions}
        assignments={mockAssignments}
      />,
    );

    const june15Cell = container.querySelector('[data-value="2026-06-15"]');
    expect(june15Cell).toBeInTheDocument();

    const indicators = june15Cell?.querySelectorAll('span.rounded-full');
    expect(indicators?.length).toBe(2);
  });

  it('opens modal when clicking a calendar day that has events', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ScheduleCalendar
        currentMonth={mockCurrentMonth}
        liveSessions={mockLiveSessions}
        assignments={mockAssignments}
      />,
    );

    const june15Cell = container.querySelector(
      '[data-value="2026-06-15"]',
    ) as HTMLElement;

    await user.click(june15Cell);

    expect(screen.getByTestId('day-events-modal')).toBeInTheDocument();
    expect(screen.getByText('Sessions Count: 1')).toBeInTheDocument();
    expect(screen.getByText('Assignments Count: 1')).toBeInTheDocument();
  });

  it('does not open modal when clicking a calendar day without events', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ScheduleCalendar
        currentMonth={mockCurrentMonth}
        liveSessions={mockLiveSessions}
        assignments={mockAssignments}
      />,
    );

    const june10Cell = container.querySelector(
      '[data-value="2026-06-10"]',
    ) as HTMLElement;

    await user.click(june10Cell);

    expect(screen.queryByTestId('day-events-modal')).not.toBeInTheDocument();
  });

  it('closes modal when triggered from child component', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ScheduleCalendar
        currentMonth={mockCurrentMonth}
        liveSessions={mockLiveSessions}
        assignments={mockAssignments}
      />,
    );

    const june15Cell = container.querySelector(
      '[data-value="2026-06-15"]',
    ) as HTMLElement;

    await user.click(june15Cell);
    expect(screen.getByTestId('day-events-modal')).toBeInTheDocument();

    const closeModalButton = screen.getByRole('button', {
      name: 'Close Modal',
    });
    await user.click(closeModalButton);

    expect(screen.queryByTestId('day-events-modal')).not.toBeInTheDocument();
  });

  it('handles items with missing startAt or availableAt gracefully', () => {
    const invalidSessions = [
      { id: 'ls-invalid', startAt: '' } as unknown as LiveSession,
    ];
    const invalidAssignments = [
      { id: 'asg-invalid', availableAt: '' } as unknown as Assignment,
    ];

    expect(() =>
      render(
        <ScheduleCalendar
          currentMonth={mockCurrentMonth}
          liveSessions={invalidSessions}
          assignments={invalidAssignments}
        />,
      ),
    ).not.toThrow();
  });
});
