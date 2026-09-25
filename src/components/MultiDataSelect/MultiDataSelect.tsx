import { useCallback, useMemo, useState } from 'react';
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  ChevronDown,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

export interface MultiDataSelectProps {
  options: SelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
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

export function MultiDataSelect({
  options,
  value = [],
  onValueChange,
  placeholder = 'Select options...',
  disabled = false,
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
}: MultiDataSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSelect = (optionValue: string) => {
    const exists = value.includes(optionValue);
    const newValue = exists
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onValueChange?.(newValue);
  };

  const handleRemove = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    onValueChange?.(value.filter((v) => v !== optionValue));
  };

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

  const selectedOptions = useMemo(() => {
    return value.map((val) => {
      const found = options.find((opt) => opt.value === val);
      return {
        value: val,
        label: found ? found.label : val,
      };
    });
  }, [value, options]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <div
          role="combobox"
          aria-expanded={isOpen}
          className={cn(
            'border-input bg-background border-dark focus:ring-ring flex min-h-9 w-full cursor-pointer flex-wrap items-center justify-between gap-1.5 rounded-md border px-3 py-1 text-xs focus:ring-1 focus:outline-none',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((item) => (
                <span
                  key={item.value}
                  className="border-dark hover:bg-bg-secondary inline-flex h-6 items-center gap-1.5 rounded-md border bg-transparent px-2 py-0.5 text-xs font-medium transition-colors"
                >
                  {item.label}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, item.value)}
                    className="hover:text-white-primary text-muted transition-colors focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-muted text-[13px]">{placeholder}</span>
            )}
          </div>
          <ChevronDown className={cn('text-muted h-4 w-4')} />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          'w-(--radix-popover-trigger-width) p-0',
          contentClassName,
        )}
        align={align}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
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
                  'placeholder:text-muted outline-none focus:outline-none',
                )}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        <div className="custom-scrollbar-small max-h-60 overflow-y-auto p-1">
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
            displayOptions.map((opt) => {
              const isSelected = value.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  className={cn(
                    'hover:bg-dark relative flex cursor-pointer items-center justify-start rounded-sm px-2 py-1.5 text-[13px] outline-none select-none',
                    opt.disabled && 'pointer-events-none opacity-50',
                    isSelected && 'bg-accent/50 font-medium',
                  )}
                >
                  {isSelected && (
                    <Check className="text-primary absolute left-2 h-3.5 w-3.5" />
                  )}
                  <span className="pl-6">{opt.label}</span>
                </div>
              );
            })
          )}
        </div>

        {pagination && (
          <div className="border-dark flex items-center justify-between border-t px-2 py-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1 || isLoading}
              className="hover:bg-dark inline-flex h-6 w-6 items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-40"
              onClick={(e) => {
                e.stopPropagation();
                pagination.onPageChange(pagination.page - 1);
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                pagination.onPageChange(pagination.page + 1);
              }}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
