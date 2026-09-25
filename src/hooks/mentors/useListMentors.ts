import { mentorHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { ListMentorsQueryParams } from '@/types/mentor';
import { useQuery } from '@tanstack/react-query';

export function useListMentors(params: ListMentorsQueryParams) {
  return useQuery({
    queryKey: mentorHttpKeys.listMentors(params),
    queryFn: () => HttpService.listMentors(params),
  });
}
