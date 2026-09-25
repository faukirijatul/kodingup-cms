import { Label } from '@/components/ui/label';
import {
  DEFAULT_PASSWORD_SETTING_FORM_VALUES,
  passwordSettingSchema,
  type PasswordSettingFormValues,
} from '@/schemas/passwordSetting';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PasswordInput } from '@/components/PasswordInput';
import { Button } from '@/components/ui/button';

export function PasswordSettingForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PasswordSettingFormValues>({
    resolver: zodResolver(passwordSettingSchema),
    defaultValues: DEFAULT_PASSWORD_SETTING_FORM_VALUES,
  });

  const handleSubmitForm = useCallback(
    async (data: PasswordSettingFormValues) => {
      console.log(data);
    },
    [],
  );

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="border-dark flex-1 rounded-lg border"
    >
      <div className="border-dark rounded-t-lg border-b p-5">
        <p className="text-white-primary text-base leading-4 font-semibold">
          Password
        </p>
      </div>

      <div className="mb-2.5 p-5">
        <div className="mb-5 flex items-center justify-between gap-2.5">
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="w-xl space-y-2.5">
            <Controller
              control={control}
              name="currentPassword"
              render={({ field }) => (
                <PasswordInput
                  id="currentPassword"
                  placeholder="Current Password"
                  {...field}
                  className="h-8.5 w-full"
                />
              )}
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between gap-2.5">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="w-xl space-y-2.5">
            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <PasswordInput
                  id="newPassword"
                  placeholder="New Password"
                  {...field}
                  className="h-8.5 w-full"
                />
              )}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between gap-2.5">
          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
          <div className="w-xl space-y-2.5">
            <Controller
              control={control}
              name="confirmNewPassword"
              render={({ field }) => (
                <PasswordInput
                  id="confirmNewPassword"
                  placeholder="Confirm New Password"
                  {...field}
                  className="h-8.5 w-full"
                />
              )}
            />
            {errors.confirmNewPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2.5">
          <Button type="submit">Update Password</Button>
        </div>
      </div>
    </form>
  );
}
