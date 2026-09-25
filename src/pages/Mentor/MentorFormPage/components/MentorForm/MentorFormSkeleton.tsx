export function MentorFormSkeleton() {
  return (
    <div className="flex w-full flex-col px-6">
      <div className="flex items-center justify-between py-6">
        <div className="flex flex-col gap-2">
          <div className="bg-dark h-7 w-36 animate-pulse rounded" />
          <div className="bg-dark h-4 w-48 animate-pulse rounded" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="bg-dark h-9 w-20 animate-pulse rounded-md" />
          <div className="bg-dark h-9 w-20 animate-pulse rounded-md" />
        </div>
      </div>

      <div className="-mt-7.5 w-full">
        <div className="mb-5 flex flex-col items-center gap-2.5">
          <div className="bg-dark h-24 w-24 animate-pulse rounded-full" />
        </div>

        <div className="grid grid-cols-3 items-start gap-5">
          <div className="flex flex-col gap-2.5 pb-6">
            <div className="bg-dark h-4 w-20 animate-pulse rounded" />
            <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
          </div>

          <div className="flex flex-col gap-2.5 pb-6">
            <div className="bg-dark h-4 w-20 animate-pulse rounded" />
            <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
          </div>

          <div className="flex flex-col gap-2.5 pb-6">
            <div className="bg-dark h-4 w-32 animate-pulse rounded" />
            <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 items-start gap-5">
          <div className="flex flex-col gap-2.5 pb-6">
            <div className="bg-dark h-4 w-12 animate-pulse rounded" />
            <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
          </div>

          <div className="flex flex-col gap-2.5 pb-6">
            <div className="bg-dark h-4 w-20 animate-pulse rounded" />
            <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pb-5">
          <div className="bg-dark h-4 w-24 animate-pulse rounded" />
          <div className="bg-dark h-29.5 w-full animate-pulse rounded-md" />
        </div>

        <div className="flex flex-col gap-2.5 pb-5">
          <div className="bg-dark h-4 w-16 animate-pulse rounded" />
          <div className="border-dark rounded-md border p-3">
            <div className="border-dark mb-3 flex gap-2 border-b pb-3">
              <div className="bg-dark h-8 w-8 animate-pulse rounded" />
              <div className="bg-dark h-8 w-8 animate-pulse rounded" />
              <div className="bg-dark h-8 w-28 animate-pulse rounded" />
              <div className="bg-dark h-8 w-32 animate-pulse rounded" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-dark h-4 w-full animate-pulse rounded" />
              <div className="bg-dark h-4 w-4/5 animate-pulse rounded" />
              <div className="bg-dark h-4 w-3/5 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
