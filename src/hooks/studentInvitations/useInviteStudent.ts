import { studentInvitationHttpKeys } from '@/configs/httpKeys';
import type { InviteStudentFormOutput } from '@/schemas/inviteStudent';
import { HttpService } from '@/services/http';
import type { InviteStudentResponse } from '@/types/studentInvitation';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useInviteStudent(
  options?: UseMutationOptions<
    InviteStudentResponse,
    Error,
    InviteStudentFormOutput
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: InviteStudentFormOutput) =>
      HttpService.inviteStudent(payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: studentInvitationHttpKeys.listStudentInvitations(),
      });
      options?.onSuccess?.(...args);
    },
  });
}
