import { assignmentHttpKeys } from '@/configs/httpKeys';
import type { CreateAssignmentFormOutput } from '@/schemas/createAssignment';
import { HttpService } from '@/services/http';
import type {
  CreateAssignmentResponse,
} from '@/types/assignment';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useCreateAssignment(
  options?: UseMutationOptions<
    CreateAssignmentResponse,
    Error,
    CreateAssignmentFormOutput
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: CreateAssignmentFormOutput) =>
      HttpService.createAssignment(payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: assignmentHttpKeys.listAssignments(),
      });
      options?.onSuccess?.(...args);
    },
  });
}
