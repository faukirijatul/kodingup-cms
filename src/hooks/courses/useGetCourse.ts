import { courseHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import { useQuery } from '@tanstack/react-query';

interface UseGetCourseOptions {
  enabled?: boolean;
}

export function useGetCourse(
  courseId: string,
  { enabled }: UseGetCourseOptions = {},
) {
  return useQuery({
    queryKey: courseHttpKeys.getCourse(courseId),
    queryFn: () => HttpService.getCourse(courseId),
    enabled,
  });
}
