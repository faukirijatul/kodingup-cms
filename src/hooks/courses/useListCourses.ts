import { courseHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { ListCoursesQueryParams } from '@/types/course';
import { useQuery } from '@tanstack/react-query';

export function useListCourses(params: ListCoursesQueryParams) {
  return useQuery({
    queryKey: courseHttpKeys.listCourses(params),
    queryFn: () => HttpService.listCourses(params),
  });
}
