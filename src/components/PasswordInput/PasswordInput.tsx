import {
  useState,
  forwardRef,
  type ComponentProps,
  useCallback,
  type ForwardedRef,
} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function PasswordInputComponent(
  { className, ...props }: ComponentProps<typeof Input>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = useCallback(function () {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-9', className)}
        {...props}
      />
      <button
        type="button"
        onClick={handleToggleShowPassword}
        className="hover:text-white-primary text-muted absolute top-1/2 right-3 -translate-y-1/2 disabled:opacity-50"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export const PasswordInput = forwardRef(PasswordInputComponent);
PasswordInput.displayName = 'PasswordInput';
