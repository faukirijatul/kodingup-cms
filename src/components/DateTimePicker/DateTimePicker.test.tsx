import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { DateTimePicker } from './DateTimePicker';

vi.mock('lucide-react', () => ({
  CalendarIcon: () => <svg data-testid="calendar-icon" />,
  ChevronLeft: () => <svg data-testid="chevron-left" />,
  ChevronRight: () => <svg data-testid="chevron-right" />,
  Clock: () => <svg data-testid="clock-icon" />,
}));

vi.mock('@/constants/calendar', () => ({
  WEEKDAYS_START_FROM_MONDAY: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
}));

vi.mock('../ui/button', () => ({
  Button: ({ children, ...props }: ComponentPropsWithoutRef<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('../ui/input', () => ({
  Input: (props: ComponentPropsWithoutRef<'input'>) => <input {...props} />,
}));

interface PopoverProps {
  children: ReactNode;
  open?: boolean;
}

interface PopoverTriggerProps {
  children: ReactNode;
  disabled?: boolean;
}

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: PopoverProps) => <div>{children}</div>,
  PopoverTrigger: ({ children }: PopoverTriggerProps) => (
    <div data-testid="popover-trigger">{children}</div>
  ),
  PopoverContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

describe('DateTimePicker Component', () => {
  const mockOnChange = vi.fn();

  it('renders default placeholder and calendar icon in datetime mode', () => {
    render(
      <DateTimePicker
        placeholder="Pick date and time"
        onChange={mockOnChange}
      />,
    );

    const triggerButton = screen
      .getByTestId('popover-trigger')
      .querySelector('button');
    expect(triggerButton).toHaveTextContent('Pick date and time');
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
  });

  it('renders clock icon when mode is time', () => {
    render(
      <DateTimePicker
        mode="time"
        placeholder="Pick time"
        onChange={mockOnChange}
      />,
    );

    const clockIcons = screen.getAllByTestId('clock-icon');
    expect(clockIcons.length).toBeGreaterThanOrEqual(1);
    expect(clockIcons[0]).toBeInTheDocument();
  });

  it('formats label correctly when value is provided', () => {
    const testDateIso = '2026-05-15T14:30:00.000Z';

    const { rerender } = render(
      <DateTimePicker value={testDateIso} mode="datetime" />,
    );
    let triggerButton = screen
      .getByTestId('popover-trigger')
      .querySelector('button');
    expect(triggerButton).toHaveTextContent(/May 15, 2026/);

    rerender(<DateTimePicker value={testDateIso} mode="date" />);
    triggerButton = screen
      .getByTestId('popover-trigger')
      .querySelector('button');
    expect(triggerButton).toHaveTextContent(/May 15th, 2026/);

    rerender(<DateTimePicker value={testDateIso} mode="time" />);
    triggerButton = screen
      .getByTestId('popover-trigger')
      .querySelector('button');
    expect(triggerButton).toHaveTextContent(/\d{2}:\d{2}/);
  });

  it('navigates through calendar months correctly using prev and next buttons', async () => {
    const user = userEvent.setup();
    render(<DateTimePicker value="2026-05-15T10:00:00.000Z" mode="date" />);

    expect(screen.getByText('May 2026')).toBeInTheDocument();

    const prevButton = screen.getByTestId('chevron-left')
      .parentElement as HTMLButtonElement;
    await user.click(prevButton);
    expect(screen.getByText('April 2026')).toBeInTheDocument();

    const nextButton = screen.getByTestId('chevron-right')
      .parentElement as HTMLButtonElement;
    await user.click(nextButton);
    await user.click(nextButton);
    expect(screen.getByText('June 2026')).toBeInTheDocument();
  });

  it('calls onChange when selecting a day from the calendar', async () => {
    const user = userEvent.setup();
    render(
      <DateTimePicker
        value="2026-05-15T10:00:00.000Z"
        mode="datetime"
        onChange={mockOnChange}
      />,
    );

    const dayButton = screen.getByRole('button', { name: '20' });
    await user.click(dayButton);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const selectedDate = new Date(mockOnChange.mock.calls[0][0]);
    expect(selectedDate.getDate()).toBe(20);
    expect(selectedDate.getMonth()).toBe(4);
  });

  it('handles hour and minute input changes correctly with clamping', () => {
    render(
      <DateTimePicker
        value="2026-05-15T10:15:00.000Z"
        mode="datetime"
        onChange={mockOnChange}
      />,
    );

    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    const hoursInput = inputs[0];
    const minutesInput = inputs[1];

    fireEvent.change(hoursInput, { target: { value: '18' } });
    expect(mockOnChange).toHaveBeenCalled();
    let updatedDate = new Date(mockOnChange.mock.calls[0][0]);
    expect(updatedDate.getHours()).toBe(18);

    fireEvent.change(minutesInput, { target: { value: '75' } });
    updatedDate = new Date(mockOnChange.mock.calls[1][0]);
    expect(updatedDate.getMinutes()).toBe(59);
  });

  it('does not render calendar grid in time mode', () => {
    render(<DateTimePicker mode="time" value="2026-05-15T10:00:00.000Z" />);

    expect(screen.queryByTestId('chevron-left')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chevron-right')).not.toBeInTheDocument();
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2);
  });

  it('does not render time inputs in date mode', () => {
    render(<DateTimePicker mode="date" value="2026-05-15T10:00:00.000Z" />);

    expect(screen.getByTestId('chevron-left')).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });
});
