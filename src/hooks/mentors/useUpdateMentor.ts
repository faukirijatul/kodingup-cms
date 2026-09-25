import { mentorHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type {
  CreateMentorResponse,
  UpdateMentorPayload,
} from '@/types/mentor';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useUpdateMentor(
  options?: UseMutationOptions<
    CreateMentorResponse,
    Error,
    UpdateMentorPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ mentorId, payload }: UpdateMentorPayload) =>
      HttpService.updateMentor({
        mentorId,
        payload,
      }),
    onSuccess: (...args) => {
      const data = args[0];

      queryClient.invalidateQueries({
        queryKey: mentorHttpKeys.listMentors(),
      });
      queryClient.invalidateQueries({
        queryKey: mentorHttpKeys.getMentor(data.data.id),
      });
      options?.onSuccess?.(...args);
    },
  });
}
