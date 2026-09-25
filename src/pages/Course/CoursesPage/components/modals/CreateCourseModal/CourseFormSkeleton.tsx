import { DialogFooter } from '@/components/ui/dialog';

export function CourseFormSkeleton() {
  return (
    <div className="flex flex-col gap-6 pt-2.5">
      <div className="flex flex-col gap-2.5">
        <div className="bg-dark h-4 w-20 animate-pulse rounded" />
        <div className="bg-dark h-49 w-full animate-pulse rounded-md" />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="bg-dark h-4 w-16 animate-pulse rounded" />
        <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="bg-dark h-4 w-12 animate-pulse rounded" />
        <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="bg-dark h-4 w-24 animate-pulse rounded" />
        <div className="bg-dark h-29.5 w-full animate-pulse rounded-md" />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="bg-dark h-4 w-28 animate-pulse rounded" />
        <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
      </div>

      <DialogFooter className="pt-2">
        <div className="bg-dark h-9 w-20 animate-pulse rounded-md" />
        <div className="bg-dark h-9 w-20 animate-pulse rounded-md" />
      </DialogFooter>
    </div>
  );
}
