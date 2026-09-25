import type { CreateCourseFormOutput } from '@/schemas/createCourse';
import type { Mentor } from './mentor';
import type { Organization } from './organization';

export interface OrganizationCourse {
  id: string;
  courseId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
}

export interface Course {
  id: string;
  mentorId: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  mentor: Mentor;
  organizationCourses: OrganizationCourse[];
  organizationIds: string[];
}

export interface ListCoursesQueryParams {
  published?: boolean;
  organizationId?: string;
  offset?: number;
  limit?: number;
  query?: string;
}

export interface UpdateCoursePayload {
  courseId: string;
  payload: CreateCourseFormOutput;
}

export interface CreateCourseResponse {
  data: Course;
}

export interface ListCoursesResponse {
  data: Course[];
  meta: {
    total: number;
  };
}

export interface GetCourseResponse {
  data: Course;
}

export interface GetCourseTotalsResponse {
  data: {
    id: string;
    title: string;
    totalModules: number;
    totalDuration: number;
  };
}
