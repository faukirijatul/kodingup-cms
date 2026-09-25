import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';

interface PendingStudentsTableSkeletonProps {
  rowCount?: number;
}

export function PendingStudentsTableSkeleton({
  rowCount = DEFAULT_PAGE_SIZE,
}: PendingStudentsTableSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={index} className="h-13.25 hover:bg-transparent">
          <TableCell>
            <div className="bg-dark h-4 w-44 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-32 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-24 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-24 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-12 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-8 w-8 animate-pulse rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
