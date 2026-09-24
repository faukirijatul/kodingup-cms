import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { loginSchema, type LoginFormValues } from '@/schemas/auth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HttpService } from '@/services/http';
import { authHttpKeys } from '@/configs/httpKeys';
import { PasswordInput } from '@/components/PasswordInput';

export function LoginForm() {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: HttpService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(authHttpKeys.currentUser, data.user);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to sign in');
    },
  });

  const handleSubmitForm = useCallback(
    async (data: LoginFormValues) => {
      mutate(data);
    },
    [mutate],
  );

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2.5">
        <Label htmlFor="email">Email</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              disabled={isPending}
              {...field}
            />
          )}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <Label htmlFor="password">Password</Label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              disabled={isPending}
              {...field}
            />
          )}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
