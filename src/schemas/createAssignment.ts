import { z } from 'zod';

export const createAssignmentSchema = z
  .object({
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
    title: z.string().min(1, 'Title is required'),
    shortDescription: z
      .string()
      .min(1, 'Short description is required')
      .max(500, 'Message must be at most 500 characters'),
    longDescription: z.string().min(1, 'Long description is required'),
    availableAt: z.string().min(1, 'Available date is required'),
    dueAt: z.string().min(1, 'Due date is required'),
  })
  .refine(
    (data) => {
      if (!data.availableAt || !data.dueAt) return true;
      return new Date(data.dueAt) > new Date(data.availableAt);
    },
    {
      message: 'Due date must be after available date',
      path: ['dueAt'],
    },
  );

export type CreateAssignmentFormInput = z.input<typeof createAssignmentSchema>;
export type CreateAssignmentFormOutput = z.output<typeof createAssignmentSchema>;

export const DEFAULT_ASSIGNMENT_FORM_VALUES: CreateAssignmentFormInput = {
  organizationId: '',
  title: '',
  shortDescription: '',
  longDescription: '',
  availableAt: '',
  dueAt: '',
};
