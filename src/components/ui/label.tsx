import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

export function Label({
  className,
  ...props
}: React.ComponentPropsWithRef<'label'>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'text-white-primary text-sm leading-3.5 font-medium tracking-normal',
        className,
      )}
      {...props}
    />
  );
}
