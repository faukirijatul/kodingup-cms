import { courseSectionHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { CourseSectionHttpArgs } from '@/types/courseSection';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useDeleteCourseSection(
  options?: UseMutationOptions<void, Error, CourseSectionHttpArgs>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ courseId, sectionPosition }: CourseSectionHttpArgs) =>
      HttpService.deleteCourseSection({ courseId, sectionPosition }),
    onSuccess: (...args) => {
      const variables = args[1];

      queryClient.invalidateQueries({
        queryKey: courseSectionHttpKeys.listCourseSections(),
      });
      queryClient.removeQueries({
        queryKey: courseSectionHttpKeys.getCourseSection(
          variables.courseId,
          variables.sectionPosition,
        ),
      });
      queryClient.removeQueries({
        queryKey: courseSectionHttpKeys.getCourseSectionTotals(
          variables.courseId,
          variables.sectionPosition,
        ),
      });

      options?.onSuccess?.(...args);
    },
  });
}
