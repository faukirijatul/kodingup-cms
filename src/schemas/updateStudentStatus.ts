import { z } from 'zod';

export const updateStudentStatusSchema = z.object({
  newStatus: z.string().min(1, 'Status is required'),
});

export type UpdateStudentStatusFormValues = z.infer<
  typeof updateStudentStatusSchema
>;

export const DEFAULT_UPDATE_STUDENT_STATUS_FORM_VALUES: UpdateStudentStatusFormValues =
  {
    newStatus: '',
  };
