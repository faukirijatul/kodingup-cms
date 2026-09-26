import { useQuery } from "@tanstack/react-query";
import { liveSessionHttpKeys } from "@/configs/httpKeys";
import { HttpService } from "@/services/http";
import type { ListLiveSessionsQueryParams } from "@/types/liveSession";

export function useListLiveSessions(params: ListLiveSessionsQueryParams) {
  return useQuery({
    queryKey: liveSessionHttpKeys.listLiveSessions(params),
    queryFn: () => HttpService.listLiveSessions(params),
  });
}