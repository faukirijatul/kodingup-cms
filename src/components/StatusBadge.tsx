import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StatusStyle {
  bg: string;
  border: string;
  text: string;
  dot: string;
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string;
  statusStyle: StatusStyle;
  dotClassName?: string;
  children?: React.ReactNode;
}

export function StatusBadge({
  status,
  statusStyle,
  className,
  dotClassName,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex h-7 min-w-7 items-center gap-1.5 rounded-full border px-2 text-xs font-medium',
        statusStyle.bg,
        statusStyle.border,
        statusStyle.text,
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'size-1.5 shrink-0 rounded-full opacity-75',
          statusStyle.dot,
          dotClassName,
        )}
      />
      {children ?? status}
    </div>
  );
}
