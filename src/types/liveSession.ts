import type { CreateLiveSessionFormOutput } from '@/schemas/createLiveSession';
import type { Organization } from './organization';

export interface LiveSession {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  provider: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
  zoomJoinUrl: string;
}

export interface UpdateLiveSessionPayload {
  liveSessionId: string;
  payload: CreateLiveSessionFormOutput;
}

export interface CreateLiveSessionResponse {
  data: LiveSession;
}

export interface ListLiveSessionsQueryParams {
  query?: string;
  organizationId?: string;
  startAtFrom?: string;
  startAtTo?: string;
  offset?: number;
  limit?: number;
}

export interface ListLiveSessionsResponse {
  data: LiveSession[];
  meta: {
    total: 0;
  };
}

export interface GetLiveSessionResponse {
  data: LiveSession;
}
