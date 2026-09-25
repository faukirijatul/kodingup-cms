import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';

interface OrganizationsTableSkeletonProps {
  rowCount?: number;
}

export function OrganizationsTableSkeleton({
  rowCount = DEFAULT_PAGE_SIZE,
}: OrganizationsTableSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={index} className="h-18.25">
          <TableCell className="w-90">
            <div className="bg-dark h-4 w-48 animate-pulse rounded" />
          </TableCell>

          <TableCell className="border-dark w-35 border-l">
            <div className="bg-dark h-4 w-28 animate-pulse rounded" />
          </TableCell>

          <TableCell className="border-dark w-12 border-l">
            <div className="bg-dark h-8 w-8 animate-pulse rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
