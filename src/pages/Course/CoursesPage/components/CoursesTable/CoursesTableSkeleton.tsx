import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';

interface CoursesTableSkeletonProps {
  rowCount?: number;
}

export function CoursesTableSkeleton({
  rowCount = DEFAULT_PAGE_SIZE,
}: CoursesTableSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={index} className="h-18.25 hover:bg-transparent">
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="bg-dark h-12 w-22 shrink-0 animate-pulse rounded-md" />
              <div className="bg-dark h-4 w-36 animate-pulse rounded" />
            </div>
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-64 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-16 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-7 w-24 animate-pulse rounded-xl" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-7 w-20 animate-pulse rounded-full" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-8 w-8 animate-pulse rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
