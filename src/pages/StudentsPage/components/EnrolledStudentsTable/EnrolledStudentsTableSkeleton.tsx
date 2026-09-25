import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';

interface EnrolledStudentsTableSkeletonProps {
  rowCount?: number;
}

export function EnrolledStudentsTableSkeleton({
  rowCount = DEFAULT_PAGE_SIZE,
}: EnrolledStudentsTableSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={index} className="h-16.5 hover:bg-transparent">
          <TableCell>
            <div className="bg-dark h-4 w-20 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="flex items-center gap-3">
              <div className="bg-dark h-8 w-8 shrink-0 animate-pulse rounded-full" />
              <div className="flex flex-col gap-1.5">
                <div className="bg-dark h-4 w-32 animate-pulse rounded" />
                <div className="bg-dark h-3 w-40 animate-pulse rounded" />
              </div>
            </div>
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-28 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-8 w-8 animate-pulse rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
