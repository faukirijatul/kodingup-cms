import { z } from 'zod';

export const createLiveSessionSchema = z
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
    startAt: z.string().min(1, 'Start date is required'),
    endAt: z.string().min(1, 'End date is required'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(500, 'Message must be at most 500 characters'),
  })
  .refine(
    (data) => {
      if (!data.startAt || !data.endAt) return true;
      return new Date(data.endAt) > new Date(data.startAt);
    },
    {
      message: 'End date must be after start date',
      path: ['endAt'],
    },
  );

export type CreateLiveSessionFormInput = z.input<
  typeof createLiveSessionSchema
>;
export type CreateLiveSessionFormOutput = z.output<
  typeof createLiveSessionSchema
>;

export const DEFAULT_LIVE_SESSION_FORM_VALUES: CreateLiveSessionFormInput = {
  organizationId: '',
  title: '',
  startAt: '',
  endAt: '',
  description: '',
};