import type {
  CreateMentorFormValues,
  CreateMentorResponse,
  GetMentorResponse,
  ListMentorsQueryParams,
  ListMentorsResponse,
  UpdateMentorPayload,
} from '@/types/mentor';
import { HOST } from './constants';
import { buildQueryString } from '@/lib/buildQueryString';
import { httpClient } from '@/lib/http';

export async function createMentor(
  payload: CreateMentorFormValues,
): Promise<CreateMentorResponse> {
  const url = `${HOST}/v1/mentors`;

  return httpClient<CreateMentorResponse>(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMentor(mentorId: string): Promise<GetMentorResponse> {
  const url = `${HOST}/v1/mentors/${mentorId}`;

  return httpClient<GetMentorResponse>(url, {
    method: 'GET',
  });
}

export async function listMentors(
  params: ListMentorsQueryParams,
): Promise<ListMentorsResponse> {
  const url = `${HOST}/v1/mentors`;
  const queryParams = params ? buildQueryString(params) : '';

  return httpClient<ListMentorsResponse>(url + queryParams, {
    method: 'GET',
  });
}

export async function updateMentor(
  data: UpdateMentorPayload,
): Promise<CreateMentorResponse> {
  const url = `${HOST}/v1/mentors/${data.mentorId}`;

  return httpClient<CreateMentorResponse>(url, {
    method: 'PATCH',
    body: JSON.stringify(data.payload),
  });
}

export async function deleteMentor(mentorId: string): Promise<void> {
  const url = `${HOST}/v1/mentors/${mentorId}`;

  return httpClient<void>(url, {
    method: 'DELETE',
  });
}
