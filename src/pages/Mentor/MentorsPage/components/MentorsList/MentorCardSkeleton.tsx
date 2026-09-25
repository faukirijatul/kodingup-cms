export function MentorCardSkeleton() {
  return (
    <div className="border-dark rounded-lg border">
      <div className="bg-dark h-40 w-full animate-pulse rounded-t-lg" />

      <div className="relative px-7.5 pt-[82.66px] pb-5">
        <div className="bg-dark absolute top-0 left-7.5 h-30 w-30 -translate-y-1/2 animate-pulse rounded-full" />

        <div className="mb-5 flex items-start justify-between">
          <div className="space-y-2">
            <div className="bg-dark h-6 w-40 animate-pulse rounded" />
            <div className="bg-dark h-5 w-28 animate-pulse rounded" />
          </div>
          <div className="bg-dark h-6 w-16 animate-pulse rounded" />
        </div>

        <div className="mb-5 space-y-2">
          <div className="bg-dark h-4 w-full animate-pulse rounded" />
          <div className="bg-dark h-4 w-3/4 animate-pulse rounded" />
        </div>

        <div className="space-y-2.5">
          <div className="bg-dark h-5 w-20 animate-pulse rounded" />
          <div className="flex flex-wrap gap-2">
            <div className="bg-dark h-6 w-16 animate-pulse rounded-[6px]" />
            <div className="bg-dark h-6 w-20 animate-pulse rounded-[6px]" />
            <div className="bg-dark h-6 w-14 animate-pulse rounded-[6px]" />
          </div>
        </div>
      </div>

      <div className="border-dark border-t px-7.5 py-5">
        <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
      </div>
    </div>
  );
}
