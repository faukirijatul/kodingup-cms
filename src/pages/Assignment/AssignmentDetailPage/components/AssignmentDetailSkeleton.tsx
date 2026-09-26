export function AssignmentDetailSkeleton() {
  return (
    <div className="flex w-full flex-col">
      <section className="bg-bg-primary mb-7.5 w-full px-6">
        <div className="bg-dark mb-5 h-4 w-24 animate-pulse rounded" />
        <div className="bg-dark mb-5 h-9 w-2/5 animate-pulse rounded" />
        <div className="bg-dark mb-2.5 h-4 w-20 animate-pulse rounded" />
        <div className="bg-dark h-4 w-3/4 animate-pulse rounded" />
      </section>

      <div className="flex w-full items-start justify-between gap-6 px-6 pb-6">
        <div className="flex-1 space-y-4">
          <div className="bg-dark h-4 w-full animate-pulse rounded" />
          <div className="bg-dark h-4 w-full animate-pulse rounded" />
          <div className="bg-dark h-4 w-4/5 animate-pulse rounded" />
          <div className="bg-dark h-32 w-full animate-pulse rounded-lg" />
        </div>

        <div className="border-dark w-90 shrink-0 rounded-lg border">
          <div className="border-dark w-full border-b p-5">
            <div className="bg-dark h-5 w-36 animate-pulse rounded" />
          </div>

          <div className="border-dark flex w-full flex-col gap-5 border-b p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="bg-dark h-4 w-28 animate-pulse rounded" />
                <div className="bg-dark h-6 w-20 animate-pulse rounded-full" />
              </div>

              <div className="bg-dark h-7 w-32 animate-pulse rounded-xl" />

              <div className="flex items-center gap-2">
                <div className="bg-dark h-4 w-4 animate-pulse rounded-full" />
                <div className="bg-dark h-4 w-32 animate-pulse rounded" />
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-dark h-4 w-4 animate-pulse rounded-full" />
                <div className="bg-dark h-4 w-48 animate-pulse rounded" />
              </div>
            </div>

            <div className="bg-bg-secondary space-y-2 rounded-lg p-4">
              <div className="bg-dark h-4 w-32 animate-pulse rounded" />
              <div className="bg-dark h-3 w-full animate-pulse rounded" />
              <div className="bg-dark h-3 w-4/5 animate-pulse rounded" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 rounded-b-lg p-5">
            <div className="bg-dark h-9 w-24 animate-pulse rounded-md" />
            <div className="bg-dark h-9 w-24 animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
