import { z } from 'zod';

export const passwordSettingSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, 'Current password must be at least 8 characters'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmNewPassword: z
      .string()
      .min(8, 'Confirm new password must be at least 8 characters'),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export type PasswordSettingFormValues = z.infer<typeof passwordSettingSchema>;

export const DEFAULT_PASSWORD_SETTING_FORM_VALUES: PasswordSettingFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};
