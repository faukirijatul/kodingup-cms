import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';

interface AssignmentsTableSkeletonProps {
  rowCount?: number;
}

export function AssignmentsTableSkeleton({
  rowCount = DEFAULT_PAGE_SIZE,
}: AssignmentsTableSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={index} className="h-16.5 hover:bg-transparent">
          <TableCell>
            <div className="bg-dark h-4 w-48 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-28 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-24 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-20 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-20 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-8 w-8 animate-pulse rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
