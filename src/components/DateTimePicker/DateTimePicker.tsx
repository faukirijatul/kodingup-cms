import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isValid,
  parseISO,
  setHours,
  setMinutes,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { WEEKDAYS_START_FROM_MONDAY } from '@/constants/calendar';
import { Input } from '../ui/input';

const START_FROM_MONDAY = 1;
const MIN_HOURS = 0;
const MAX_HOURS = 23;
const MIN_MINUTES = 0;
const MAX_MINUTES = 59;
const RADIX_BASE_TEN = 10;
const DEFAULT_FALLBACK_VALUE = 0;
const POPOVER_SIDE_OFFSET = 6;
const POPOVER_COLLISION_PADDING = 10;

interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  mode?: 'datetime' | 'date' | 'time';
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

export function DateTimePicker({
  value,
  onChange,
  mode = 'datetime',
  placeholder,
  disabled = false,
  className,
  contentClassName,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedDate = useMemo(() => {
    if (!value) return null;
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }, [value]);

  const [viewMonth, setViewMonth] = useState<Date>(selectedDate || new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, {
      weekStartsOn: START_FROM_MONDAY,
    });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: START_FROM_MONDAY });

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [viewMonth]);

  const handleSelectDate = useCallback(
    (day: Date) => {
      const newDate = selectedDate ? new Date(selectedDate) : new Date();
      newDate.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());

      onChange?.(newDate.toISOString());

      if (mode === 'date') {
        setIsOpen(false);
      }
    },
    [onChange, selectedDate, mode],
  );

  const handleTimeChange = useCallback(
    (type: 'hours' | 'minutes', val: number) => {
      let newDate = selectedDate ? new Date(selectedDate) : new Date();
      if (type === 'hours') {
        const clampedHours = Math.max(MIN_HOURS, Math.min(MAX_HOURS, val));
        newDate = setHours(newDate, clampedHours);
      } else {
        const clampedMinutes = Math.max(
          MIN_MINUTES,
          Math.min(MAX_MINUTES, val),
        );
        newDate = setMinutes(newDate, clampedMinutes);
      }

      onChange?.(newDate.toISOString());
    },
    [selectedDate, onChange],
  );

  const handleHoursInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsedVal =
        parseInt(e.target.value, RADIX_BASE_TEN) || DEFAULT_FALLBACK_VALUE;
      handleTimeChange('hours', parsedVal);
    },
    [handleTimeChange],
  );

  const handleMinutesInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsedVal =
        parseInt(e.target.value, RADIX_BASE_TEN) || DEFAULT_FALLBACK_VALUE;
      handleTimeChange('minutes', parsedVal);
    },
    [handleTimeChange],
  );

  const handleNextMonth = useCallback(() => {
    setViewMonth((prev) => addMonths(prev, 1));
  }, []);

  const handlePrevMonth = useCallback(() => {
    setViewMonth((prev) => subMonths(prev, 1));
  }, []);

  const displayLabel = useMemo(() => {
    if (!selectedDate) return null;
    if (mode === 'date') return format(selectedDate, 'PPP');
    if (mode === 'time') return format(selectedDate, 'hh:mm a');
    return format(selectedDate, 'MMM dd, yyyy hh:mm a');
  }, [selectedDate, mode]);

  const currentHours = selectedDate
    ? selectedDate.getHours()
    : DEFAULT_FALLBACK_VALUE;
  const currentMinutes = selectedDate
    ? selectedDate.getMinutes()
    : DEFAULT_FALLBACK_VALUE;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'border-dark text-white-primary h-9 w-full justify-start bg-transparent px-3 text-left text-xs font-normal',
            !selectedDate && 'text-muted',
            className,
          )}
        >
          {mode === 'time' ? (
            <Clock className="text-muted mr-2 h-4 w-4" />
          ) : (
            <CalendarIcon className="text-muted mr-2 h-4 w-4" />
          )}
          {displayLabel || placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="top"
        sideOffset={POPOVER_SIDE_OFFSET}
        collisionPadding={POPOVER_COLLISION_PADDING}
        className={cn(
          'w-68 border-none bg-transparent p-0 shadow-none',
          contentClassName,
        )}
      >
        <div className="border-dark bg-bg-secondary flex flex-col rounded-md border shadow-lg">
          {mode !== 'time' && (
            <div className="p-2">
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="hover:bg-dark text-muted hover:text-white-primary flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-white-primary text-xs font-medium">
                  {format(viewMonth, 'MMMM yyyy')}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="hover:bg-dark text-muted hover:text-white-primary flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-1 grid grid-cols-7 text-center">
                {WEEKDAYS_START_FROM_MONDAY.map((day) => (
                  <span
                    key={day}
                    className="text-muted text-[11px] font-medium"
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((day) => (
                  <CalendarDayButton
                    key={day.toISOString()}
                    day={day}
                    viewMonth={viewMonth}
                    selectedDate={selectedDate}
                    onSelect={handleSelectDate}
                  />
                ))}
              </div>
            </div>
          )}

          {mode !== 'date' && (
            <div
              className={cn(
                'flex items-center gap-2 p-2',
                mode === 'datetime' && 'border-dark border-t',
              )}
            >
              <Clock className="text-muted h-4 w-4" />
              <div className="flex flex-1 items-center justify-center gap-1">
                <Input
                  type="number"
                  min={MIN_HOURS}
                  max={MAX_HOURS}
                  value={String(currentHours).padStart(2, '0')}
                  onChange={handleHoursInputChange}
                  className="h-8 w-12 text-center text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-muted font-medium">:</span>
                <Input
                  type="number"
                  min={MIN_MINUTES}
                  max={MAX_MINUTES}
                  value={String(currentMinutes).padStart(2, '0')}
                  onChange={handleMinutesInputChange}
                  className="h-8 w-12 text-center text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface CalendarDayButtonProps {
  day: Date;
  viewMonth: Date;
  selectedDate: Date | null;
  onSelect: (day: Date) => void;
}

function CalendarDayButton({
  day,
  viewMonth,
  selectedDate,
  onSelect,
}: CalendarDayButtonProps) {
  const handleClick = useCallback(() => {
    onSelect(day);
  }, [day, onSelect]);

  const isCurrentMonth = isSameMonth(day, viewMonth);
  const isSelected = selectedDate && isSameDay(day, selectedDate);
  const isDayToday = isToday(day);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md text-xs transition-colors',
        !isCurrentMonth && 'text-muted/40',
        isCurrentMonth && 'text-white-primary hover:bg-dark cursor-pointer',
        isDayToday && 'bg-dark',
        isSelected &&
          'bg-bg-primary hover:bg-bg-primary font-medium text-white',
      )}
    >
      {format(day, 'd')}
    </button>
  );
}
