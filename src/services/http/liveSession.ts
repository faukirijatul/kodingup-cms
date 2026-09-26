import type {
  CreateLiveSessionResponse,
  GetLiveSessionResponse,
  ListLiveSessionsQueryParams,
  ListLiveSessionsResponse,
  UpdateLiveSessionPayload,
} from '@/types/liveSession';
import type { CreateLiveSessionFormOutput } from '@/schemas/createLiveSession';
import { buildQueryString } from '@/lib/buildQueryString';
import { httpClient } from '@/lib/http';
import { HOST } from './constants';

export async function createLiveSession(
  payload: CreateLiveSessionFormOutput,
): Promise<CreateLiveSessionResponse> {
  const url = `${HOST}/v1/live-sessions`;

  return httpClient<CreateLiveSessionResponse>(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listLiveSessions(
  params: ListLiveSessionsQueryParams,
): Promise<ListLiveSessionsResponse> {
  const url = `${HOST}/v1/live-sessions`;
  const queryParams = params ? buildQueryString(params) : '';

  return httpClient<ListLiveSessionsResponse>(url + queryParams, {
    method: 'GET',
  });
}

export async function getLiveSession(
  liveSessionId: string,
): Promise<GetLiveSessionResponse> {
  const url = `${HOST}/v1/live-sessions/${liveSessionId}`;

  return httpClient<GetLiveSessionResponse>(url, {
    method: 'GET',
  });
}

export async function updateLiveSession(
  data: UpdateLiveSessionPayload,
): Promise<CreateLiveSessionResponse> {
  const url = `${HOST}/v1/live-sessions/${data.liveSessionId}`;

  return httpClient<CreateLiveSessionResponse>(url, {
    method: 'PATCH',
    body: JSON.stringify(data.payload),
  });
}

export async function deleteLiveSession(liveSessionId: string): Promise<void> {
  const url = `${HOST}/v1/live-sessions/${liveSessionId}`;

  return httpClient<void>(url, {
    method: 'DELETE',
  });
}
