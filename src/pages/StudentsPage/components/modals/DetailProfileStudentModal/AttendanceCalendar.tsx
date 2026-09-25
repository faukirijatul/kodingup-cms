import { useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  parseISO,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WEEKDAYS_START_FROM_SUNDAY } from '@/constants/calendar';
import type { Attendance } from '@/types/student';

const START_FROM_SUNDAY = 0;

interface AttendanceCalendarProps {
  attendances?: Attendance[];
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
}

export function AttendanceCalendar({
  attendances = [],
  currentMonth,
  onMonthChange,
}: AttendanceCalendarProps) {
  const handlePrevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const handleNextMonth = () => onMonthChange(addMonths(currentMonth, 1));

  const isThisMonth = isSameMonth(currentMonth, new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, {
      weekStartsOn: START_FROM_SUNDAY,
    });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: START_FROM_SUNDAY });

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const attendanceMap = useMemo(() => {
    const map = new Map<string, 'attended' | 'missed'>();

    attendances.forEach((item) => {
      if (!item.firstJoinedAt) return;
      const dateKey = format(parseISO(item.firstJoinedAt), 'yyyy-MM-dd');

      const status = item.duration > 0 ? 'attended' : 'missed';
      map.set(dateKey, status);
    });

    return map;
  }, [attendances]);

  return (
    <div className="relative h-122.5 w-full rounded-xl p-5">
      <div className="mb-4 flex h-8.5 items-center justify-between">
        <h3 className="text-shadow-white-primary text-xl leading-7 font-normal">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="hover:bg-dark flex h-8.5 w-8.5 items-center justify-center rounded-md transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            disabled={isThisMonth}
            className="hover:bg-dark disabled:text-muted flex h-8.5 w-8.5 items-center justify-center rounded-md transition-colors hover:text-white disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAYS_START_FROM_SUNDAY.map((day) => (
          <div key={day} className="flex h-7 items-center justify-center">
            <span className="text-white-primary text-sm font-normal">
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-7 text-center">
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const dateKey = format(day, 'yyyy-MM-dd');
          const attendanceStatus = attendanceMap.get(dateKey);
          const isDayToday = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className="relative flex h-14 min-h-10 flex-col items-center justify-center"
            >
              {isCurrentMonth && (
                <>
                  <span
                    className={`text-center text-xl leading-7 font-normal ${
                      isDayToday ? 'text-white' : 'text-muted'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>

                  {attendanceStatus && (
                    <span
                      className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                        attendanceStatus === 'attended'
                          ? 'bg-green'
                          : 'bg-[#FB2C36]'
                      }`}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-muted absolute bottom-5 left-5 flex h-5 items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="bg-green h-1.5 w-1.5 rounded-full" />
          <span>Attended</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FB2C36]" />
          <span>Missed</span>
        </div>
      </div>
    </div>
  );
}
