import { mentorHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useDeleteMentor(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (mentorId: string) =>
      HttpService.deleteMentor(mentorId),
    onSuccess: (...args) => {
      const variables = args[1];

      queryClient.invalidateQueries({
        queryKey: mentorHttpKeys.listMentors(),
      });
      queryClient.removeQueries({
        queryKey: mentorHttpKeys.getMentor(variables),
      });

      options?.onSuccess?.(...args);
    },
  });
}
