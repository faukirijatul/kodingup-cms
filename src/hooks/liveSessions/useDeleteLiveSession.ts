import { liveSessionHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useDeleteLiveSession(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (liveSessionId: string) =>
      HttpService.deleteLiveSession(liveSessionId),
    onSuccess: (...args) => {
      const variables = args[1];

      queryClient.invalidateQueries({
        queryKey: liveSessionHttpKeys.listLiveSessions(),
      });
      queryClient.removeQueries({
        queryKey: liveSessionHttpKeys.getLiveSession(variables),
      });

      options?.onSuccess?.(...args);
    },
  });
}
