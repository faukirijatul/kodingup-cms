import { liveSessionHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import { useQuery } from '@tanstack/react-query';

interface UseGetLiveSessionOptions {
  enabled?: boolean;
}

export function useGetLiveSession(
  LiveSessionId: string,
  { enabled }: UseGetLiveSessionOptions = {},
) {
  return useQuery({
    queryKey: liveSessionHttpKeys.getLiveSession(LiveSessionId),
    queryFn: () => HttpService.getLiveSession(LiveSessionId),
    enabled,
  });
}
