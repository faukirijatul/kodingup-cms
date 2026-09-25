import { buildQueryString } from '@/lib/buildQueryString';
import type {
  CourseSectionModuleHttpArgs,
  ListCourseSectionModulesQueryParams,
  ListCourseSectionModulesResponse,
} from '@/types/courseSectionModule';
import { HOST } from './constants';
import { httpClient } from '@/lib/http';

export async function listCourseSectionModules(
  params: ListCourseSectionModulesQueryParams,
): Promise<ListCourseSectionModulesResponse> {
  const url = `${HOST}/v1/courses/${params.courseId}/sections/${params.sectionPosition}/modules`;
  const queryParams = params ? buildQueryString(params) : '';

  return httpClient<ListCourseSectionModulesResponse>(url + queryParams, {
    method: 'GET',
  });
}

export async function deleteCourseSectionModule({
  courseId,
  sectionPosition,
  modulePosition,
}: CourseSectionModuleHttpArgs): Promise<void> {
  const url = `${HOST}/v1/courses/${courseId}/sections/${sectionPosition}/modules/${modulePosition}`;

  return httpClient<void>(url, {
    method: 'DELETE',
  });
}
