import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { DayEventsModal } from './DayEventsModal';
import { AssignmentCard } from './AssignmentCard';
import { LiveSessionCard } from './LiveSessionCard';
import type { Assignment } from '@/types/assignment';
import type { LiveSession } from '@/types/liveSession';
import type { DayEvents } from '@/types/schedule';

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: ComponentPropsWithoutRef<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@/components/icons/IconCalendar', () => ({
  IconCalendar: () => <span data-testid="icon-calendar" />,
}));

vi.mock('@/components/icons/IconClock', () => ({
  IconClock: () => <span data-testid="icon-clock" />,
}));

const mockLiveSession: LiveSession = {
  id: 'ls-1',
  title: 'React Performance Live',
  description: 'Learn optimization strategies in React.',
  startAt: '2026-06-15T09:00:00.000Z',
  endAt: '2026-06-15T11:00:00.000Z',
  zoomJoinUrl: 'https://zoom.us/j/123456789',
} as unknown as LiveSession;

const mockAssignment: Assignment = {
  id: 'asg-1',
  title: 'Build custom hooks assignment',
  shortDescription: 'Implement custom state hooks for data fetching.',
  longDescription: 'Detailed instructions on creating robust hooks.',
  availableAt: '2026-06-10T08:00:00.000Z',
  dueAt: '2026-06-20T23:59:00.000Z',
} as unknown as Assignment;

describe('AssignmentCard Component', () => {
  it('renders assignment details and formatted dates correctly', () => {
    render(<AssignmentCard assignment={mockAssignment} />);

    expect(screen.getByText('Assignment')).toBeInTheDocument();
    expect(
      screen.getByText('Build custom hooks assignment'),
    ).toBeInTheDocument();

    expect(screen.getByText(/Available at/i)).toBeInTheDocument();
    expect(screen.getByText(/Due at/i)).toBeInTheDocument();

    expect(
      screen.getByText('Implement custom state hooks for data fetching.'),
    ).toBeInTheDocument();
  });

  it('falls back to longDescription if shortDescription is missing', () => {
    const assignmentWithoutShortDesc = {
      ...mockAssignment,
      shortDescription: '',
    };

    render(<AssignmentCard assignment={assignmentWithoutShortDesc} />);

    expect(
      screen.getByText('Detailed instructions on creating robust hooks.'),
    ).toBeInTheDocument();
  });

  it('handles "View Assignment" button click and logs assignment ID', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<AssignmentCard assignment={mockAssignment} />);

    const button = screen.getByRole('button', { name: 'View Assignment' });
    fireEvent.click(button);

    expect(consoleSpy).toHaveBeenCalledWith('asg-1');
    consoleSpy.mockRestore();
  });
});

describe('LiveSessionCard Component', () => {
  it('renders live session details and formatted times correctly', () => {
    render(<LiveSessionCard liveSession={mockLiveSession} />);

    expect(screen.getByText('Live Session')).toBeInTheDocument();
    expect(screen.getByText('React Performance Live')).toBeInTheDocument();

    expect(
      screen.getByText(/\d{2}:\d{2} [AP]M - \d{2}:\d{2} [AP]M/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Learn optimization strategies in React.'),
    ).toBeInTheDocument();
  });

  it('opens zoom join URL in a new browser tab on "Join Meeting" click', async () => {
    const user = userEvent.setup();
    const windowOpenSpy = vi
      .spyOn(window, 'open')
      .mockImplementation(() => null);

    render(<LiveSessionCard liveSession={mockLiveSession} />);

    const joinButton = screen.getByRole('button', { name: 'Join Meeting' });
    await user.click(joinButton);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://zoom.us/j/123456789',
      '_blank',
      'noopener,noreferrer',
    );

    windowOpenSpy.mockRestore();
  });
});

describe('DayEventsModal Component', () => {
  const mockOnOpenChange = vi.fn();

  it('renders live sessions and assignments inside modal when open', () => {
    const mockEvents: DayEvents = {
      liveSessions: [mockLiveSession],
      assignments: [mockAssignment],
    } as unknown as DayEvents;

    render(
      <DayEventsModal
        open={true}
        onOpenChange={mockOnOpenChange}
        events={mockEvents}
      />,
    );

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();

    expect(screen.getByText('React Performance Live')).toBeInTheDocument();
    expect(
      screen.getByText('Build custom hooks assignment'),
    ).toBeInTheDocument();
  });

  it('renders nothing when open is false', () => {
    const mockEvents: DayEvents = {
      liveSessions: [mockLiveSession],
      assignments: [mockAssignment],
    } as unknown as DayEvents;

    render(
      <DayEventsModal
        open={false}
        onOpenChange={mockOnOpenChange}
        events={mockEvents}
      />,
    );

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('renders container cleanly when there are no live sessions or assignments', () => {
    const emptyEvents: DayEvents = {
      liveSessions: [],
      assignments: [],
    } as unknown as DayEvents;

    render(
      <DayEventsModal
        open={true}
        onOpenChange={mockOnOpenChange}
        events={emptyEvents}
      />,
    );

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(
      screen.queryByText('React Performance Live'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Build custom hooks assignment'),
    ).not.toBeInTheDocument();
  });
});
