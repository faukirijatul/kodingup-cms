import { useCallback, useMemo, useState } from 'react';
import {
  endOfMonth,
  startOfMonth,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  parseISO,
} from 'date-fns';
import { WEEKDAYS_START_FROM_MONDAY } from '@/constants/calendar';
import { cn } from '@/lib/utils';
import type { Assignment } from '@/types/assignment';
import type { LiveSession } from '@/types/liveSession';
import type { DayEvents } from '@/types/schedule';
import { DayEventsModal } from '../DayEventsModal';

const START_FROM_MONDAY = 1;

interface ScheduleCalendarProps {
  currentMonth: string | Date;
  liveSessions: LiveSession[];
  assignments: Assignment[];
}

export function ScheduleCalendar({
  currentMonth,
  liveSessions,
  assignments,
}: ScheduleCalendarProps) {
  const [isDayEventsListModalOpen, setIsDayEventsListModalOpen] =
    useState(false);
  const [dayEventsList, setDayEventsList] = useState<DayEvents | null>(null);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, {
      weekStartsOn: START_FROM_MONDAY,
    });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: START_FROM_MONDAY });

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const eventsMap = useMemo(() => {
    const map = new Map<string, DayEvents>();

    const getOrCreateDayEvents = (dateKey: string): DayEvents => {
      if (!map.has(dateKey)) {
        map.set(dateKey, { liveSessions: [], assignments: [] });
      }

      return map.get(dateKey)!;
    };

    liveSessions?.forEach((liveSession) => {
      if (!liveSession.startAt) return;
      const dateKey = format(parseISO(liveSession.startAt), 'yyyy-MM-dd');
      getOrCreateDayEvents(dateKey).liveSessions.push(liveSession);
    });

    assignments?.forEach((assignment) => {
      if (!assignment.availableAt) return;
      const dateKey = format(parseISO(assignment.availableAt), 'yyyy-MM-dd');
      getOrCreateDayEvents(dateKey).assignments.push(assignment);
    });

    return map;
  }, [liveSessions, assignments]);

  const handleDayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.currentTarget as HTMLElement;
      const dateKey = target.dataset.value;

      const dayEvents = eventsMap.get(dateKey!);

      if (!dayEvents) return;

      setIsDayEventsListModalOpen(true);
      setDayEventsList(dayEvents);
    },
    [eventsMap],
  );

  return (
    <>
      <div className="grid grid-cols-7">
        {WEEKDAYS_START_FROM_MONDAY.map((day) => (
          <div
            key={day}
            className="border-dark flex h-10 items-center justify-center border-b border-l bg-[#18181B66] first:border-l-0"
          >
            <span className="text-white-primary text-[13px] leading-[18.57px] font-normal">
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center">
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsMap.get(dateKey);
          const isDayToday = isToday(day);
          const isHasEvents =
            dayEvents &&
            (dayEvents?.liveSessions.length > 0 ||
              dayEvents?.assignments.length > 0);

          return (
            <div
              key={day.toISOString()}
              onClick={handleDayClick}
              data-value={dateKey}
              className={cn(
                'border-dark hover:bg-dark flex h-24 flex-col items-start justify-between border-b border-l p-4 nth-[7n+1]:border-l-0',
                isDayToday && 'bg-bg-secondary/40',
                isHasEvents && 'cursor-pointer',
              )}
            >
              <span
                className={cn(
                  'text-sm leading-5 font-normal',
                  isDayToday
                    ? 'text-white'
                    : isCurrentMonth
                      ? 'text-muted'
                      : 'text-muted/50',
                )}
              >
                {format(day, 'd')}
              </span>

              {dayEvents && (
                <div className="flex items-center gap-1.5">
                  {dayEvents.liveSessions.length > 0 && (
                    <span className="h-4 w-4 rounded-full bg-[#2B7FFF]" />
                  )}

                  {dayEvents.assignments.length > 0 && (
                    <span className="h-4 w-4 rounded-full bg-[#FF6900]" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-muted flex h-15 w-full items-center gap-4 px-5 text-sm">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2B7FFF]" />
          <span>Live Session</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6900]" />
          <span>Assignment</span>
        </div>
      </div>

      {isDayEventsListModalOpen && (
        <DayEventsModal
          open={isDayEventsListModalOpen}
          onOpenChange={setIsDayEventsListModalOpen}
          events={dayEventsList!}
        />
      )}
    </>
  );
}
