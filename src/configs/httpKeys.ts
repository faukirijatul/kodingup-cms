import type { ListAssignmentsQueryParams } from '@/types/assignment';
import type { ListCoursesQueryParams } from '@/types/course';
import type { ListCourseSectionsQueryParams } from '@/types/courseSection';
import type { ListLiveSessionsQueryParams } from '@/types/liveSession';
import type { ListMentorsQueryParams } from '@/types/mentor';
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

export const courseHttpKeys = {
  all: ['courses'] as const,
  listCourses: (params?: ListCoursesQueryParams) =>
    params
      ? ([...courseHttpKeys.all, 'list', params] as const)
      : ([...courseHttpKeys.all, 'list'] as const),
  getCourse: (courseId: string) => [...courseHttpKeys.all, courseId] as const,
  getCourseTotals: (courseId: string) =>
    [...courseHttpKeys.all, 'totals', courseId] as const,
};

export const courseSectionHttpKeys = {
  all: ['courseSections'] as const,
  listCourseSections: (params?: ListCourseSectionsQueryParams) =>
    params
      ? ([...courseSectionHttpKeys.all, 'list', params] as const)
      : ([...courseSectionHttpKeys.all, 'list'] as const),
  getCourseSection: (courseId: string, sectionPosition: string) =>
    [...courseSectionHttpKeys.all, courseId, sectionPosition] as const,
  getCourseSectionTotals: (courseId: string, sectionPosition: string) =>
    [
      ...courseSectionHttpKeys.all,
      'totals',
      courseId,
      sectionPosition,
    ] as const,
};

export const courseSectionModuleHttpKeys = {
  all: ['courseSectionModules'] as const,
  listCourseSectionModules: (params?: ListCourseSectionsQueryParams) =>
    params
      ? ([...courseSectionModuleHttpKeys.all, 'list', params] as const)
      : ([...courseSectionModuleHttpKeys.all, 'list'] as const),
  getCourseSectionModule: (courseId: string, sectionPosition: string) =>
    [...courseSectionModuleHttpKeys.all, courseId, sectionPosition] as const,
};

export const mentorHttpKeys = {
  all: ['mentors'] as const,
  listMentors: (params?: ListMentorsQueryParams) =>
    params
      ? ([...mentorHttpKeys.all, 'list', params] as const)
      : ([...mentorHttpKeys.all, 'list'] as const),
  getMentor: (mentorId: string) => [...mentorHttpKeys.all, mentorId] as const,
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

export const liveSessionHttpKeys = {
  all: ['liveSessions'] as const,
  listLiveSessions: (params?: ListLiveSessionsQueryParams) =>
    params
      ? ([...liveSessionHttpKeys.all, 'list', params] as const)
      : ([...liveSessionHttpKeys.all, 'list'] as const),
  getLiveSession: (liveSessionId: string) =>
    [...liveSessionHttpKeys.all, liveSessionId] as const,
};

export const assignmentHttpKeys = {
  all: ['assignments'] as const,
  listAssignments: (params?: ListAssignmentsQueryParams) =>
    params
      ? ([...assignmentHttpKeys.all, 'list', params] as const)
      : ([...assignmentHttpKeys.all, 'list'] as const),
  getAssignment: (assignmentId: string) =>
    [...assignmentHttpKeys.all, assignmentId] as const,
};
