import { WEEKDAYS_START_FROM_MONDAY } from '@/constants/calendar';

export function ScheduleCalendarSkeleton() {
  return (
    <div className="border-dark relative w-full rounded-xl border">
      <div className="border-dark flex h-18.5 items-center justify-between border-b p-5">
        <div className="bg-dark h-8.5 w-8.5 animate-pulse rounded-md" />
        <div className="bg-dark h-7 w-28 animate-pulse rounded-md" />
        <div className="bg-dark h-8.5 w-8.5 animate-pulse rounded-md" />
      </div>

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
        {Array.from({ length: 35 }).map((_, index) => (
          <div
            key={index}
            className="border-dark flex h-24 flex-col items-start justify-between border-b border-l p-4 nth-[7n+1]:border-l-0"
          >
            <div className="bg-dark h-5 w-5 animate-pulse rounded-md" />

            <div className="flex items-center gap-1.5">
              <div className="bg-dark h-4 w-4 animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex h-15 w-full items-center gap-4 px-5">
        <div className="bg-dark h-4 w-24 animate-pulse rounded-md" />
        <div className="bg-dark h-4 w-24 animate-pulse rounded-md" />
      </div>
    </div>
  );
}
