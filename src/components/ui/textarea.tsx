import { cn } from '@/lib/utils';
import * as React from 'react';

export function Textarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'border-dark flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm',
        'placeholder:text-muted',
        'shadow-[0px_1px_2px_0px_#0000000D]',
        'focus:outline-none focus-visible:shadow-[0px_0px_0px_3px_#52525C4D] focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'resize-none',
        className,
      )}
      {...props}
    />
  );
}
