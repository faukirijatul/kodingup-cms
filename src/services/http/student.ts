import { buildQueryString } from '@/lib/buildQueryString';
import type {
  GetStudentAttendancesParams,
  GetStudentAttendancesResponse,
  GetStudentResponse,
  ListStudentsQueryParams,
  ListStudentsResponse,
} from '@/types/student';
import { HOST } from './constants';
import { httpClient } from '@/lib/http';

export async function listStudents(
  params: ListStudentsQueryParams,
): Promise<ListStudentsResponse> {
  const url = `${HOST}/v1/students`;
  const queryParams = params ? buildQueryString(params) : '';

  return httpClient<ListStudentsResponse>(url + queryParams, {
    method: 'GET',
  });
}

export async function getStudent(
  studentId: string,
): Promise<GetStudentResponse> {
  const url = `${HOST}/v1/students/${studentId}`;

  return httpClient<GetStudentResponse>(url, {
    method: 'GET',
  });
}

export async function getStudentAttendances(
  params: GetStudentAttendancesParams,
): Promise<GetStudentAttendancesResponse> {
  const url = `${HOST}/v1/students/${params.studentId}/attendances`;
  const queryParams = buildQueryString(params);

  return httpClient<GetStudentAttendancesResponse>(url + queryParams, {
    method: 'GET',
  });
}
