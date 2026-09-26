import type { CreateAssignmentFormOutput } from '@/schemas/createAssignment';
import type { Organization } from './organization';

export interface Assignment {
  id: string;
  organizationId: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  availableAt: string;
  dueAt: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
}

export interface UpdateAssignmentPayload {
  assignmentId: string;
  payload: CreateAssignmentFormOutput;
}

export interface CreateAssignmentResponse {
  data: Assignment;
}

export interface ListAssignmentsQueryParams {
  query?: string;
  organizationId?: string;
  published?: boolean;
  status?: 'ongoing' | 'completed';
  availableAtFrom?: string;
  availableAtTo?: string;
  offset?: number;
  limit?: number;
}

export interface ListAssignmentsResponse {
  data: Assignment[];
  meta: {
    total: 0;
  };
}

export interface GetAssignmentResponse {
  data: Assignment;
}

