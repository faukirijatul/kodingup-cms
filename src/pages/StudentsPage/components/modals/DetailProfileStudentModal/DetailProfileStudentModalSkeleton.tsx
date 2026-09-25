export function DetailProfileStudentModalSkeleton() {
  return (
    <>
      <div className="flex flex-col items-center pt-9">
        <div className="bg-dark mb-5 h-24 w-24 animate-pulse rounded-full" />
        <div className="bg-dark mb-3.5 h-6 w-20 animate-pulse rounded-full" />
        <div className="bg-dark mb-3.5 h-7 w-40 animate-pulse rounded-md" />
      </div>

      <div className="mb-9 flex h-5 items-center justify-center gap-4.5">
        <div className="bg-dark h-5 w-20 animate-pulse rounded" />
        <div className="bg-dark h-5 w-24 animate-pulse rounded" />
        <div className="bg-dark h-5 w-36 animate-pulse rounded" />
        <div className="bg-dark h-5 w-28 animate-pulse rounded" />
      </div>
    </>
  );
}
