import { mentorHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type {
  CreateMentorFormValues,
  CreateMentorResponse,
} from '@/types/mentor';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useCreateMentor(
  options?: UseMutationOptions<
    CreateMentorResponse,
    Error,
    CreateMentorFormValues
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: CreateMentorFormValues) =>
      HttpService.createMentor(payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: mentorHttpKeys.listMentors(),
      });
      options?.onSuccess?.(...args);
    },
  });
}
