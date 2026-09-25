import { DialogFooter } from '@/components/ui/dialog';

export function OrganizationFormSkeleton() {
  return (
    <div className="flex flex-col pt-2.5">
      <div className="flex flex-col gap-2.5 pb-6">
        <div className="bg-dark h-4 w-32 animate-pulse rounded" />
        <div className="bg-dark h-9 w-full animate-pulse rounded-md" />
      </div>

      <DialogFooter>
        <div className="bg-dark h-9 w-20 animate-pulse rounded-md" />
        <div className="bg-dark h-9 w-20 animate-pulse rounded-md" />
      </DialogFooter>
    </div>
  );
}
