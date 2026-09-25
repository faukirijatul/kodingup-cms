import { courseSectionHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { CourseSectionHttpArgs } from '@/types/courseSection';
import { useQuery } from '@tanstack/react-query';

interface UseGetCourseSectionOptions {
  enabled?: boolean;
}

export function useGetCourseSection(
  { courseId, sectionPosition }: CourseSectionHttpArgs,
  { enabled }: UseGetCourseSectionOptions = {},
) {
  return useQuery({
    queryKey: courseSectionHttpKeys.getCourseSection(courseId, sectionPosition),
    queryFn: () => HttpService.getCourseSection({ courseId, sectionPosition }),
    enabled,
  });
}
