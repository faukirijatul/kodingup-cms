import { liveSessionHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type {
  CreateLiveSessionResponse,
  UpdateLiveSessionPayload,
} from '@/types/liveSession';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useUpdateLiveSession(
  options?: UseMutationOptions<
    CreateLiveSessionResponse,
    Error,
    UpdateLiveSessionPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ liveSessionId, payload }: UpdateLiveSessionPayload) =>
      HttpService.updateLiveSession({
        liveSessionId,
        payload,
      }),
    onSuccess: (...args) => {
      const data = args[0];

      queryClient.invalidateQueries({
        queryKey: liveSessionHttpKeys.listLiveSessions(),
      });
      queryClient.invalidateQueries({
        queryKey: liveSessionHttpKeys.getLiveSession(data.data.id),
      });
      options?.onSuccess?.(...args);
    },
  });
}
