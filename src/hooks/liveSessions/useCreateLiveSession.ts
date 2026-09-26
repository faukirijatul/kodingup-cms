import { liveSessionHttpKeys } from '@/configs/httpKeys';
import type { CreateLiveSessionFormOutput } from '@/schemas/createLiveSession';
import { HttpService } from '@/services/http';
import type {
  CreateLiveSessionResponse,
} from '@/types/liveSession';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useCreateLiveSession(
  options?: UseMutationOptions<
    CreateLiveSessionResponse,
    Error,
    CreateLiveSessionFormOutput
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: CreateLiveSessionFormOutput) =>
      HttpService.createLiveSession(payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionHttpKeys.listLiveSessions(),
      });
      options?.onSuccess?.(...args);
    },
  });
}
