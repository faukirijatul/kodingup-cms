import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AttendanceCalendar } from './AttendanceCalendar';

describe('AttendanceCalendar', () => {
  const mockOnMonthChange = vi.fn();
  const testDate = new Date(2026, 8, 1);

  it('renders month title and weekday headers correctly', () => {
    render(
      <AttendanceCalendar
        currentMonth={testDate}
        onMonthChange={mockOnMonthChange}
      />,
    );

    expect(screen.getByText('September 2026')).toBeInTheDocument();
    expect(screen.getByText('Attended')).toBeInTheDocument();
    expect(screen.getByText('Missed')).toBeInTheDocument();
  });

  it('triggers onMonthChange with previous month on prev button click', async () => {
    const user = userEvent.setup();
    render(
      <AttendanceCalendar
        currentMonth={testDate}
        onMonthChange={mockOnMonthChange}
      />,
    );

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    expect(mockOnMonthChange).toHaveBeenCalledTimes(1);
  });

  it('disables next month button if currentMonth is equal to current actual month', () => {
    const today = new Date();
    render(
      <AttendanceCalendar
        currentMonth={today}
        onMonthChange={mockOnMonthChange}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toBeDisabled();
  });
});
