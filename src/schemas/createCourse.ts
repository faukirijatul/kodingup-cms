import { z } from 'zod';

export const createCourseSchema = z.object({
  thumbnailUrl: z
    .union([
      z.instanceof(File),
      z.string().min(1, 'Thumbnail is required'),
      z.null(),
    ])
    .refine((val) => val !== null && val !== '', {
      message: 'Thumbnail is required',
    }),
  mentorId: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, 'Mentor is required')
        .refine((val) => !isNaN(Number(val)), 'Mentor must be a valid number'),
    )
    .transform(Number),
  title: z.string().min(1, 'Title is required'),
  description: z
    .string()
    .max(500, 'Message must be at most 500 characters')
    .optional(),
  organizationIds: z.array(
    z
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
  ),
});

export type CreateCourseFormInput = z.input<typeof createCourseSchema>;
export type CreateCourseFormOutput = z.output<typeof createCourseSchema>;

export const DEFAULT_COURSE_FORM_VALUES: CreateCourseFormInput = {
  thumbnailUrl: '',
  mentorId: '',
  title: '',
  description: '',
  organizationIds: [],
};
