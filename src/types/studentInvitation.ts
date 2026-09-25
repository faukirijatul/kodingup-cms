import type {
  ListStudentsQueryParams,
  ListStudentsResponse,
  Student,
} from './student';

export interface ListStudentInvitationsQueryParams extends ListStudentsQueryParams {
  accepted?: boolean;
}

export type ListStudentInvitationsResponse = ListStudentsResponse;

export interface InviteStudentResponse {
  data: Student;
  meta: {
    link: string;
  };
}