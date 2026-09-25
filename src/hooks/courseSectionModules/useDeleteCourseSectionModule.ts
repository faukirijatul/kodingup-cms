import { courseSectionModuleHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { CourseSectionModuleHttpArgs } from '@/types/courseSectionModule';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useDeleteCourseSectionModule(
  options?: UseMutationOptions<void, Error, CourseSectionModuleHttpArgs>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({
      courseId,
      sectionPosition,
      modulePosition,
    }: CourseSectionModuleHttpArgs) =>
      HttpService.deleteCourseSectionModule({
        courseId,
        sectionPosition,
        modulePosition,
      }),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: courseSectionModuleHttpKeys.listCourseSectionModules(),
      });

      options?.onSuccess?.(...args);
    },
  });
}
