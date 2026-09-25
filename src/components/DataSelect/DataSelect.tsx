import { useCallback, useMemo, useState } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type PaginationConfig = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export interface DataSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  align?: 'start' | 'center' | 'end';

  searchable?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;

  pagination?: PaginationConfig;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Select option',
  disabled,
  className,
  contentClassName,
  align = 'start',
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearchChange,
  searchQuery: controlledSearchQuery,
  pagination,
  isLoading = false,
  emptyMessage = 'No options available',
}: DataSelectProps) {
  const [internalSearch, setInternalSearch] = useState('');

  const isControlledSearch = controlledSearchQuery !== undefined;
  const isServerSearch = typeof onSearchChange === 'function';

  const searchQuery = useMemo(() => {
    return isControlledSearch ? controlledSearchQuery : internalSearch;
  }, [isControlledSearch, controlledSearchQuery, internalSearch]);

  const displayOptions = useMemo(() => {
    if (!searchable || isServerSearch || !searchQuery.trim()) {
      return options;
    }
    const lower = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(lower));
  }, [options, searchable, isServerSearch, searchQuery]);

  const totalPages = useMemo(() => {
    if (!pagination) return 1;
    return Math.max(1, Math.ceil(pagination.total / pagination.pageSize));
  }, [pagination]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      if (!isControlledSearch) {
        setInternalSearch(query);
      }
      onSearchChange?.(query);
    },
    [isControlledSearch, onSearchChange],
  );

  const handlePrevPage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!pagination) return;
      pagination.onPageChange(pagination.page - 1);
    },
    [pagination],
  );

  const handleNextPage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!pagination) return;
      pagination.onPageChange(pagination.page + 1);
    },
    [pagination],
  );

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn('h-8.5 w-42 text-[13px]', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className={cn(contentClassName, 'p-0!')} align={align}>
        {searchable && (
          <div className="border-dark border-b p-2">
            <div className="relative">
              <Search className="text-muted absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className={cn(
                  'border-dark flex h-8 w-full rounded-md border bg-transparent py-1 pr-3 pl-8 text-xs',
                  'placeholder:text-muted outline-none',
                  'focus:outline-none',
                )}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        <div className="custom-scrollbar-small max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="text-muted flex h-60 items-center justify-center gap-2 text-xs">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : displayOptions.length === 0 ? (
            <div className="text-muted py-4 text-center text-xs">
              {emptyMessage}
            </div>
          ) : (
            displayOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="text-[13px]"
              >
                {opt.label}
              </SelectItem>
            ))
          )}
        </div>

        {pagination && (
          <div className="border-dark flex items-center justify-between border-t px-2 py-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1 || isLoading}
              className="hover:bg-dark inline-flex h-6 w-6 items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-40"
              onClick={handlePrevPage}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <span className="text-muted text-[11px]">
              {pagination.page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={pagination.page >= totalPages || isLoading}
              className="hover:bg-dark inline-flex h-6 w-6 items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-40"
              onClick={handleNextPage}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
