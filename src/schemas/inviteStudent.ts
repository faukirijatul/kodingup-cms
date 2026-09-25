import { z } from 'zod';

export const inviteStudentSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  organizationId: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, 'Organization is required')
        .refine(
          (val) => !isNaN(Number(val)),
          'Organization must be a valid number',
        ),
    )
    .transform(Number),
  message: z
    .string()
    .max(500, 'Message must be at most 500 characters')
    .optional(),
});

export type InviteStudentFormInput = z.input<typeof inviteStudentSchema>;
export type InviteStudentFormOutput = z.output<typeof inviteStudentSchema>;

export const DEFAULT_INVITE_STUDENT_FORM_VALUES: InviteStudentFormInput = {
  email: '',
  organizationId: '',
  message: '',
};
