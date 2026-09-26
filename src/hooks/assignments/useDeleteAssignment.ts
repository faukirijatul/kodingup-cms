import { assignmentHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useDeleteAssignment(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (assignmentId: string) =>
      HttpService.deleteAssignment(assignmentId),
    onSuccess: (...args) => {
      const variables = args[1];

      queryClient.invalidateQueries({
        queryKey: assignmentHttpKeys.listAssignments(),
      });
      queryClient.removeQueries({
        queryKey: assignmentHttpKeys.getAssignment(variables),
      });

      options?.onSuccess?.(...args);
    },
  });
}
