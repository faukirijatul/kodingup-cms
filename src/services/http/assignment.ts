import type {
  CreateAssignmentResponse,
  GetAssignmentResponse,
  ListAssignmentsQueryParams,
  ListAssignmentsResponse,
  UpdateAssignmentPayload,
} from '@/types/assignment';
import { buildQueryString } from '@/lib/buildQueryString';
import { httpClient } from '@/lib/http';
import { HOST } from './constants';
import type { CreateAssignmentFormOutput } from '@/schemas/createAssignment';

export async function createAssignment(
  payload: CreateAssignmentFormOutput,
): Promise<CreateAssignmentResponse> {
  const url = `${HOST}/v1/assignments`;

  return httpClient<CreateAssignmentResponse>(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listAssignments(
  params: ListAssignmentsQueryParams,
): Promise<ListAssignmentsResponse> {
  const url = `${HOST}/v1/assignments`;
  const queryParams = params ? buildQueryString(params) : '';

  return httpClient<ListAssignmentsResponse>(url + queryParams, {
    method: 'GET',
  });
}

export async function getAssignment(
  assignmentId: string,
): Promise<GetAssignmentResponse> {
  const url = `${HOST}/v1/assignments/${assignmentId}`;

  return httpClient<GetAssignmentResponse>(url, {
    method: 'GET',
  });
}

export async function updateAssignment(
  data: UpdateAssignmentPayload,
): Promise<CreateAssignmentResponse> {
  const url = `${HOST}/v1/assignments/${data.assignmentId}`;

  return httpClient<CreateAssignmentResponse>(url, {
    method: 'PATCH',
    body: JSON.stringify(data.payload),
  });
}

export async function deleteAssignment(assignmentId: string): Promise<void> {
  const url = `${HOST}/v1/assignments/${assignmentId}`;

  return httpClient<void>(url, {
    method: 'DELETE',
  });
}
