import { DialogFooter } from '@/components/ui/dialog';

export function LiveSessionFormSkeleton() {
  return (
    <div className="flex flex-col pt-2.5">
      <div className="flex flex-col gap-2.5 pb-6">
        <div className="bg-dark h-4 w-24 animate-pulse rounded" />
        <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
      </div>

      <div className="flex flex-col gap-2.5 pb-6">
        <div className="bg-dark h-4 w-12 animate-pulse rounded" />
        <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
      </div>

      <div className="flex w-full items-end justify-between gap-4 pb-6">
        <div className="flex flex-1 flex-col gap-2.5">
          <div className="bg-dark h-4 w-20 animate-pulse rounded" />
          <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
        </div>

        <div className="border-dark h-4.25 w-4 border-t" />

        <div className="flex flex-1 flex-col gap-2.5">
          <div className="bg-dark h-4 w-18 animate-pulse rounded" />
          <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pb-5">
        <div className="bg-dark h-4 w-20 animate-pulse rounded" />
        <div className="bg-dark h-43.75 w-full animate-pulse rounded-md" />
      </div>

      <DialogFooter>
        <div className="bg-dark h-9 w-20 animate-pulse rounded-md" />
        <div className="bg-dark h-9 w-20 animate-pulse rounded-md" />
      </DialogFooter>
    </div>
  );
}
