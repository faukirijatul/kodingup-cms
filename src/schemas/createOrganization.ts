import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export type CreateOrganizationFormValues = z.infer<
  typeof createOrganizationSchema
>;

export const DEFAULT_ORGANIZATION_FORM_VALUE: CreateOrganizationFormValues = {
  name: '',
};
