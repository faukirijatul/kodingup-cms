import { mentorHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import { useQuery } from '@tanstack/react-query';

interface UseGetMentorOptions {
  enabled?: boolean;
}

export function useGetMentor(
  MentorId: string,
  { enabled }: UseGetMentorOptions = {},
) {
  return useQuery({
    queryKey: mentorHttpKeys.getMentor(MentorId),
    queryFn: () => HttpService.getMentor(MentorId),
    enabled,
  });
}
