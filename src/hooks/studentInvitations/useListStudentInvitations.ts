import { studentInvitationHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { ListStudentInvitationsQueryParams } from '@/types/studentInvitation';
import { useQuery } from '@tanstack/react-query';

export function useListStudentInvitations(
  params: ListStudentInvitationsQueryParams,
) {
  return useQuery({
    queryKey: studentInvitationHttpKeys.listStudentInvitations(params),
    queryFn: () => HttpService.listStudentInvitations(params),
  });
}
