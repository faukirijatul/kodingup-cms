import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';

interface CourseSectionsTableSkeletonProps {
  rowCount?: number;
}

export function CourseSectionsTableSkeleton({
  rowCount = DEFAULT_PAGE_SIZE,
}: CourseSectionsTableSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={index} className="h-18.25 hover:bg-transparent">
          <TableCell className="w-30">
            <div className="bg-dark h-4 w-8 animate-pulse rounded" />
          </TableCell>

          <TableCell>
            <div className="bg-dark h-4 w-48 animate-pulse rounded" />
          </TableCell>

          <TableCell className="w-45">
            <div className="bg-dark h-4 w-24 animate-pulse rounded" />
          </TableCell>

          <TableCell className="w-12">
            <div className="bg-dark h-8 w-8 animate-pulse rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
