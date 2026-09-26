import { useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import {
  addMonths,
  subMonths,
  endOfMonth,
  startOfMonth,
  isSameMonth,
  format,
} from 'date-fns';
import { useListAssignments } from '@/hooks/assignments/useListAssignments';
import { useListLiveSessions } from '@/hooks/liveSessions/useListLiveSessions';
import { ScheduleCalendarSkeleton } from './ScheduleCalendarSkeleton';
import { ScheduleCalendar } from '../ScheduleCalendar';

const OFFSET = 0;
const LIMIT = 50;

interface ScheduleCalendarProps {
  selectedOrgId: string;
}

export function ScheduleCalendarContainer({
  selectedOrgId,
}: ScheduleCalendarProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentMonth = useMemo(() => {
    return searchParams.get('month') || new Date();
  }, [searchParams]);

  const startAtFrom = startOfMonth(currentMonth).toISOString();
  const startAtTo = endOfMonth(currentMonth).toISOString();

  const isThisMonth = isSameMonth(currentMonth, new Date());

  const { data: liveSessions, isLoading: isLiveSessionsLoading } =
    useListLiveSessions({
      organizationId: selectedOrgId,
      startAtFrom,
      startAtTo,
      offset: OFFSET,
      limit: LIMIT,
    });

  const { data: assignments, isLoading: isAssignmentsLoading } =
    useListAssignments({
      organizationId: selectedOrgId,
      published: true,
      availableAtFrom: startAtFrom,
      availableAtTo: startAtTo,
      offset: OFFSET,
      limit: LIMIT,
    });

  const handleNextMonth = useCallback(() => {
    const nextMonth = addMonths(currentMonth, 1);
    setSearchParams(
      (prev) => {
        prev.set('month', nextMonth.toISOString());
        return prev;
      },
      { replace: true },
    );
  }, [currentMonth, setSearchParams]);

  const handlePrevMonth = useCallback(() => {
    const prevMonth = subMonths(currentMonth, 1);
    setSearchParams(
      (prev) => {
        prev.set('month', prevMonth.toISOString());
        return prev;
      },
      { replace: true },
    );
  }, [currentMonth, setSearchParams]);

  if (isAssignmentsLoading || isLiveSessionsLoading) {
    return <ScheduleCalendarSkeleton />;
  }

  return (
    <div className="border-dark relative w-full rounded-xl border">
      <div className="border-dark flex h-18.5 items-center justify-between border-b p-5">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="bg-dark hover:bg-bg-secondary flex h-8.5 w-8.5 items-center justify-center rounded-md transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-shadow-white-primary text-xl leading-7 font-normal">
          {format(currentMonth, 'MMM yyyy')}
        </h3>
        <button
          type="button"
          onClick={handleNextMonth}
          disabled={isThisMonth}
          className="bg-dark hover:bg-bg-secondary disabled:text-muted flex h-8.5 w-8.5 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <ScheduleCalendar
        currentMonth={currentMonth}
        liveSessions={liveSessions?.data || []}
        assignments={assignments?.data || []}
      />
    </div>
  );
}
