import type {
  CourseSectionHttpArgs,
  GetCourseSectionResponse,
  GetCourseSectionTotalsResponse,
  ListCourseSectionsQueryParams,
  ListCourseSectionsResponse,
} from '@/types/courseSection';
import { HOST } from './constants';
import { buildQueryString } from '@/lib/buildQueryString';
import { httpClient } from '@/lib/http';

export async function listCourseSections(
  params: ListCourseSectionsQueryParams,
): Promise<ListCourseSectionsResponse> {
  const url = `${HOST}/v1/courses/${params.courseId}/sections`;
  const queryParams = params ? buildQueryString(params) : '';

  return httpClient<ListCourseSectionsResponse>(url + queryParams, {
    method: 'GET',
  });
}

export async function getCourseSection({
  courseId,
  sectionPosition,
}: CourseSectionHttpArgs): Promise<GetCourseSectionResponse> {
  const url = `${HOST}/v1/courses/${courseId}/sections/${sectionPosition}`;

  return httpClient<GetCourseSectionResponse>(url, {
    method: 'GET',
  });
}

export async function getCourseSectionTotals({
  courseId,
  sectionPosition,
}: CourseSectionHttpArgs): Promise<GetCourseSectionTotalsResponse> {
  const url = `${HOST}/v1/courses/${courseId}/sections/${sectionPosition}/count`;

  return httpClient<GetCourseSectionTotalsResponse>(url, {
    method: 'GET',
  });
}

export async function deleteCourseSection({
  courseId,
  sectionPosition,
}: CourseSectionHttpArgs): Promise<void> {
  const url = `${HOST}/v1/courses/${courseId}/sections/${sectionPosition}`;

  return httpClient<void>(url, {
    method: 'DELETE',
  });
}
