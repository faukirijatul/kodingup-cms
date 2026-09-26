export function AssignmentFormSkeleton() {
  return (
    <div className="flex w-full items-start justify-between gap-7.5 px-6">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-2.5 pb-6">
          <div className="bg-dark h-4 w-12 animate-pulse rounded" />
          <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
        </div>

        <div className="flex flex-col gap-2.5 pb-5">
          <div className="bg-dark h-4 w-24 animate-pulse rounded" />
          <div className="bg-dark h-43.75 w-full animate-pulse rounded-md" />
        </div>

        <div className="flex flex-col gap-2.5 pb-6">
          <div className="bg-dark h-4 w-24 animate-pulse rounded" />
          <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
        </div>

        <div className="flex w-full items-end justify-between gap-4 pb-6">
          <div className="flex flex-1 flex-col gap-2.5">
            <div className="bg-dark h-4 w-28 animate-pulse rounded" />
            <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
          </div>

          <div className="flex flex-1 flex-col gap-2.5">
            <div className="bg-dark h-4 w-20 animate-pulse rounded" />
            <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
          </div>
        </div>
      </div>

      <div className="border-dark w-90 shrink-0 rounded-lg border">
        <div className="border-dark w-full border-b p-5">
          <div className="bg-dark h-6 w-36 animate-pulse rounded" />
        </div>

        <div className="border-dark flex w-full flex-col gap-5 border-b p-5">
          <div className="flex items-center justify-between">
            <div className="bg-dark h-4 w-28 animate-pulse rounded" />
            <div className="bg-dark h-6 w-20 animate-pulse rounded-full" />
          </div>

          <div className="bg-bg-secondary flex flex-col gap-2 rounded-lg p-4">
            <div className="bg-dark h-4 w-32 animate-pulse rounded" />
            <div className="bg-dark h-3 w-full animate-pulse rounded" />
            <div className="bg-dark h-3 w-4/5 animate-pulse rounded" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 rounded-b-lg p-5">
          <div className="bg-dark h-9 w-20 animate-pulse rounded-md" />
          <div className="bg-dark h-9 w-24 animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
