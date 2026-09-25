import { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ROWS_PER_PAGE_OPTIONS } from '@/constants/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  rowsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  rowsPerPage,
  rowsPerPageOptions = ROWS_PER_PAGE_OPTIONS,
  onPageChange,
  onRowsPerPageChange,
  className,
}: PaginationProps) {
  const startRow = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalItems);

  const pageNumbers: (number | 'ellipsis')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1, 2, 3, 4, 5, 'ellipsis', totalPages);
  }

  const handleRowsPerPageChange = useCallback(
    (value: string) => {
      onRowsPerPageChange(Number(value));
    },
    [onRowsPerPageChange],
  );

  const handlePrevPage = useCallback(
    () => onPageChange(Math.max(1, currentPage - 1)),
    [onPageChange, currentPage],
  );

  const handleClickPageButton = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const value = Number(event.currentTarget.dataset.value);
      onPageChange(value);
    },
    [onPageChange],
  );

  const handleNextPage = useCallback(
    () => onPageChange(Math.min(totalPages, currentPage + 1)),
    [onPageChange, currentPage, totalPages],
  );

  return (
    <div
      className={cn(
        'border-dark flex h-14 items-center justify-between border-t px-5 py-3',
        className,
      )}
    >
      <div className="flex h-7 items-center gap-2.5">
        <span className="text-muted text-sm leading-5 font-normal">
          Rows per page
        </span>
        <Select
          value={String(rowsPerPage)}
          onValueChange={handleRowsPerPageChange}
        >
          <SelectTrigger className="h-7 w-14 text-[12px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {rowsPerPageOptions.map((n) => (
              <SelectItem key={n} value={String(n)} className="text-[12px]">
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex h-7 items-center gap-2.5">
        <p className="text-muted text-sm">
          {startRow} - {endRow} of {totalItems}
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={handlePrevPage}
            className={cn(
              'text-muted flex h-7 w-7 items-center justify-center rounded-md',
              'hover:text-white-primary hover:bg-dark',
              'disabled:pointer-events-none disabled:opacity-40',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pageNumbers.map((p, idx) =>
            p === 'ellipsis' ? (
              <span key={idx} className="text-muted px-1">
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={handleClickPageButton}
                data-value={p}
                className={cn(
                  'flex h-7 min-w-7 items-center justify-center rounded-md text-sm',
                  p === currentPage
                    ? 'text-white-primary bg-dark'
                    : 'hover:text-white-primary hover:bg-dark text-[#A1A1AA]',
                )}
              >
                {p}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={handleNextPage}
            className={cn(
              'text-muted flex h-7 w-7 items-center justify-center rounded-md',
              'hover:text-white-primary hover:bg-dark',
              'disabled:pointer-events-none disabled:opacity-40',
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
