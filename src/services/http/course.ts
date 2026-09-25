import type {
  CreateCourseResponse,
  GetCourseResponse,
  GetCourseTotalsResponse,
  ListCoursesQueryParams,
  ListCoursesResponse,
  UpdateCoursePayload,
} from '@/types/course';
import { buildQueryString } from '@/lib/buildQueryString';
import { httpClient } from '@/lib/http';
import { HOST } from './constants';
import type { CreateCourseFormOutput } from '@/schemas/createCourse';

export async function createCourse(
  payload: CreateCourseFormOutput,
): Promise<CreateCourseResponse> {
  const url = `${HOST}/v1/courses`;

  return httpClient<CreateCourseResponse>(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getCourse(courseId: string): Promise<GetCourseResponse> {
  const url = `${HOST}/v1/courses/${courseId}`;

  return httpClient<GetCourseResponse>(url, {
    method: 'GET',
  });
}

export async function getCourseTotals(
  courseId: string,
): Promise<GetCourseTotalsResponse> {
  const url = `${HOST}/v1/courses/${courseId}/count`;

  return httpClient<GetCourseTotalsResponse>(url, {
    method: 'GET',
  });
}

export async function listCourses(
  params: ListCoursesQueryParams,
): Promise<ListCoursesResponse> {
  const url = `${HOST}/v1/courses`;
  const queryParams = params ? buildQueryString(params) : '';

  return httpClient<ListCoursesResponse>(url + queryParams, {
    method: 'GET',
  });
}

export async function updateCourse(
  data: UpdateCoursePayload,
): Promise<CreateCourseResponse> {
  const url = `${HOST}/v1/courses/${data.courseId}`;

  return httpClient<CreateCourseResponse>(url, {
    method: 'PATCH',
    body: JSON.stringify(data.payload),
  });
}

export async function deleteCourse(courseId: string): Promise<void> {
  const url = `${HOST}/v1/courses/${courseId}`;

  return httpClient<void>(url, {
    method: 'DELETE',
  });
}
