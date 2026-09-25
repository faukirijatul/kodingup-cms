import { buildQueryString } from '@/lib/buildQueryString';
import { HOST } from './constants';
import { httpClient } from '@/lib/http';
import type {
  CreateOrganizationResponse,
  GetOrganizationResponse,
  ListOrganizationsQueryParams,
  ListOrganizationsResponse,
  UpdateOrganizationPayload,
} from '@/types/organization';
import type { CreateOrganizationFormValues } from '@/schemas/createOrganization';

export async function createOrganization(
  payload: CreateOrganizationFormValues,
): Promise<CreateOrganizationResponse> {
  const url = `${HOST}/v1/organizations`;

  return httpClient<CreateOrganizationResponse>(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listOrganizations(
  params: ListOrganizationsQueryParams,
): Promise<ListOrganizationsResponse> {
  const url = `${HOST}/v1/organizations`;
  const queryParams = params ? buildQueryString(params) : '';

  return httpClient<ListOrganizationsResponse>(url + queryParams, {
    method: 'GET',
  });
}

export async function getOrganization(
  organizationId: string,
): Promise<GetOrganizationResponse> {
  const url = `${HOST}/v1/organizations/${organizationId}`;

  return httpClient<GetOrganizationResponse>(url, {
    method: 'GET',
  });
}

export async function updateOrganization(
  data: UpdateOrganizationPayload,
): Promise<CreateOrganizationResponse> {
  const url = `${HOST}/v1/organizations/${data.organizationId}`;

  return httpClient<CreateOrganizationResponse>(url, {
    method: 'PATCH',
    body: JSON.stringify(data.payload),
  });
}

export async function deleteOrganization(
  organizationId: string,
): Promise<void> {
  const url = `${HOST}/v1/organizations/${organizationId}`;

  return httpClient<void>(url, {
    method: 'DELETE',
  });
}
