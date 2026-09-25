import { courseHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import { useQuery } from '@tanstack/react-query';

interface UseGetCourseTotalsOptions {
  enabled?: boolean;
}

export function useGetCourseTotals(
  courseId: string,
  { enabled }: UseGetCourseTotalsOptions = {},
) {
  return useQuery({
    queryKey: courseHttpKeys.getCourseTotals(courseId),
    queryFn: () => HttpService.getCourseTotals(courseId),
    enabled,
  });
}
