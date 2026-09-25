import type { Organization } from './organization';

export interface Student {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  profileUrl?: string;
  gender: string;
  organizationId: string;
  organization: Organization;
  updatedAt: string;
  createdAt: string;
  expiresAt: string;
}

export interface ListStudentsQueryParams {
  offset?: number;
  limit?: number;
  query?: string;
  organizationId?: string;
}

export interface ListStudentsResponse {
  data: Student[];
  meta: {
    total: number;
  };
}

export interface GetStudentResponse {
  data: Student;
}

export interface GetStudentAttendancesParams {
  studentId: string;
  startAt: string;
  endAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  liveSessionId: string;
  firstJoinedAt: string;
  lastLeftAt: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetStudentAttendancesResponse {
  data: Attendance[];
  meta: {
    total: number;
  };
}
