import { buildQueryString } from '@/lib/buildQueryString';
import { HOST } from './constants';
import { httpClient } from '@/lib/http';
import type {
  InviteStudentFormValues,
  InviteStudentResponse,
  ListStudentInvitationsQueryParams,
  ListStudentInvitationsResponse,
} from '@/types/studentInvitation';

export async function inviteStudent(
  payload: InviteStudentFormValues,
): Promise<InviteStudentResponse> {
  const url = `${HOST}/v1/student-invitations`;

  return httpClient<InviteStudentResponse>(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listStudentInvitations(
  params: ListStudentInvitationsQueryParams,
): Promise<ListStudentInvitationsResponse> {
  const url = `${HOST}/v1/student-invitations`;
  const queryParams = params ? buildQueryString(params) : '';

  return httpClient<ListStudentInvitationsResponse>(url + queryParams, {
    method: 'GET',
  });
}
