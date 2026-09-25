export function CourseHeroSkeleton() {
  return (
    <section className="bg-bg-primary mb-7.5 flex w-full items-start justify-between gap-7.5 px-6 pt-5">
      <div className="flex flex-1 flex-col gap-5">
        <div className="bg-dark h-10 w-3/4 animate-pulse rounded-md" />

        <div className="flex flex-col gap-2.5">
          <div className="bg-dark h-6 w-36 animate-pulse rounded" />
          <div className="flex flex-col gap-2">
            <div className="bg-dark h-4 w-full animate-pulse rounded" />
            <div className="bg-dark h-4 w-4/5 animate-pulse rounded" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4.5">
          <div className="bg-dark h-5 w-24 animate-pulse rounded" />
          <div className="bg-dark h-5 w-20 animate-pulse rounded" />
          <div className="bg-dark h-5 w-36 animate-pulse rounded" />
          <div className="bg-dark h-7 w-20 animate-pulse rounded-xl" />
        </div>

        <div className="flex h-8.5 items-center justify-start gap-2.5">
          <div className="bg-dark h-8.5 w-24 animate-pulse rounded-[6px]" />
          <div className="bg-dark h-8.5 w-28 animate-pulse rounded-[6px]" />
        </div>
      </div>

      <div className="bg-dark h-74 w-114 shrink-0 animate-pulse rounded-lg" />
    </section>
  );
}
