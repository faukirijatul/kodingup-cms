import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface EmptyTableRowProps {
  colSpan?: number;
  message?: string;
  className?: string;
  rowClassName?: string;
}

export function EmptyTableRow({
  colSpan = 1,
  message = 'No data to show',
  className,
  rowClassName,
}: EmptyTableRowProps) {
  return (
    <TableRow className={cn('hover:bg-transparent', rowClassName)}>
      <TableCell
        colSpan={colSpan}
        className={cn('text-muted h-100 text-center', className)}
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
