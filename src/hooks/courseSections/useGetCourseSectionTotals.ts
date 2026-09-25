import { courseSectionHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { CourseSectionHttpArgs } from '@/types/courseSection';
import { useQuery } from '@tanstack/react-query';

interface UseGetCourseSectionTotalsOptions {
  enabled?: boolean;
}

export function useGetCourseSectionTotals(
  { courseId, sectionPosition }: CourseSectionHttpArgs,
  { enabled }: UseGetCourseSectionTotalsOptions = {},
) {
  return useQuery({
    queryKey: courseSectionHttpKeys.getCourseSectionTotals(
      courseId,
      sectionPosition,
    ),
    queryFn: () =>
      HttpService.getCourseSectionTotals({ courseId, sectionPosition }),
    enabled,
  });
}
