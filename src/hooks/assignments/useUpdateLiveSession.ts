import { assignmentHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type {
  CreateAssignmentResponse,
  UpdateAssignmentPayload,
} from '@/types/assignment';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useUpdateAssignment(
  options?: UseMutationOptions<
    CreateAssignmentResponse,
    Error,
    UpdateAssignmentPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ assignmentId, payload }: UpdateAssignmentPayload) =>
      HttpService.updateAssignment({
        assignmentId,
        payload,
      }),
    onSuccess: (...args) => {
      const data = args[0];

      queryClient.invalidateQueries({
        queryKey: assignmentHttpKeys.listAssignments(),
      });
      queryClient.invalidateQueries({
        queryKey: assignmentHttpKeys.getAssignment(data.data.id),
      });
      options?.onSuccess?.(...args);
    },
  });
}
