import type { CreateOrganizationFormValues } from '@/schemas/createOrganization';

export interface Organization {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}

export interface ListOrganizationsQueryParams {
  offset?: number;
  limit?: number;
  query?: string;
}

export interface ListOrganizationsResponse {
  data: Organization[];
  meta: {
    total: number;
  };
}

export interface UpdateOrganizationPayload {
  organizationId: string;
  payload: CreateOrganizationFormValues;
}

export interface CreateOrganizationResponse {
  data: Organization;
}

export interface GetOrganizationResponse {
  data: Organization;
}
