import { z } from 'zod';

export const createMentorSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  companyLogoUrl: z
    .union([
      z.instanceof(File),
      z.string().min(1, 'Company thumbnail is required'),
      z.null(),
    ])
    .refine((val) => val !== null && val !== '', {
      message: 'Company thumbnail is required',
    }),
  shortDescription: z
    .string()
    .min(1, 'Short description is required')
    .max(500, 'Message must be at most 500 characters'),
  longDescription: z.string().min(1, 'Long description is required'),
  avatarUrl: z
    .union([
      z.instanceof(File),
      z.string().min(1, 'Avatar is required'),
      z.null(),
    ])
    .refine((val) => val !== null && val !== '', {
      message: 'Avatar is required',
    }),
  expertises: z.string().min(1, 'Expertises are required'),
});

export type CreateMentorFormValues = z.infer<typeof createMentorSchema>;
