import type { ListOrganizationsQueryParams } from '@/types/organization';
import type {
  GetStudentAttendancesParams,
  ListStudentsQueryParams,
} from '@/types/student';
import type { ListStudentInvitationsQueryParams } from '@/types/studentInvitation';

export const authHttpKeys = {
  currentUser: ['currentUser'] as const,
};

export const studentHttpKeys = {
  all: ['students'] as const,
  listStudents: (params?: ListStudentsQueryParams) =>
    params
      ? ([...studentHttpKeys.all, 'list', params] as const)
      : ([...studentHttpKeys.all, 'list'] as const),
  getStudent: (studentId: string) =>
    [...studentHttpKeys.all, studentId] as const,
  getStudentAttendances: (params: GetStudentAttendancesParams) =>
    params
      ? ([...studentHttpKeys.all, 'attendances', params] as const)
      : ([...studentHttpKeys.all, 'attendances'] as const),
};

export const studentInvitationHttpKeys = {
  all: ['studentInvitations'] as const,
  listStudentInvitations: (params?: ListStudentInvitationsQueryParams) =>
    params
      ? ([...studentInvitationHttpKeys.all, 'list', params] as const)
      : ([...studentInvitationHttpKeys.all, 'list'] as const),
};

export const organizationHttpKeys = {
  all: ['organizations'] as const,
  listOrganizations: (params?: ListOrganizationsQueryParams) =>
    params
      ? ([...organizationHttpKeys.all, 'list', params] as const)
      : ([...organizationHttpKeys.all, 'list'] as const),
  getOrganization: (organizationId: string) =>
    [...organizationHttpKeys.all, organizationId] as const,
};
