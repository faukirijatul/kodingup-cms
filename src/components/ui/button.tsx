import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium text-[13px] leading-[18.57px] gap-1.5 rounded-[6px] px-3 py-2 cursor-pointer transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blue text-white hover:bg-blue-600/90',
        secondary: 'bg-dark text-white-primary hover:bg-dark/80',
        destructive: 'bg-red text-white hover:bg-red-600/90',
        outline:
          'bg-transparent text-white-primary border border-dark hover:bg-dark/10',
        'destructive-ghost': 'bg-transparent text-red/90 hover:bg-red/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  asChild = false,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
}

Button.displayName = 'Button';
