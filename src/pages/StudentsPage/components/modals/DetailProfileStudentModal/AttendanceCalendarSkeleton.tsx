import { WEEKDAYS_START_FROM_SUNDAY } from '@/constants/calendar';

export function AttendanceCalendarSkeleton() {
  return (
    <div className="relative h-122.5 w-full rounded-xl p-5">
      <div className="mb-4 flex h-8.5 items-center justify-between">
        <div className="bg-dark h-7 w-36 animate-pulse rounded-md" />
        <div className="flex items-center gap-1">
          <div className="bg-dark h-8.5 w-8.5 animate-pulse rounded-md" />
          <div className="bg-dark h-8.5 w-8.5 animate-pulse rounded-md" />
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
        {Array.from({ length: 35 }).map((_, index) => (
          <div
            key={index}
            className="flex h-14 min-h-10 items-center justify-center"
          >
            <div className="bg-dark h-6 w-6 animate-pulse rounded-md" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-5 flex h-5 items-center gap-4">
        <div className="bg-dark h-4 w-20 animate-pulse rounded" />
        <div className="bg-dark h-4 w-20 animate-pulse rounded" />
      </div>
    </div>
  );
}
