import { courseHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { CreateCourseResponse, UpdateCoursePayload } from '@/types/course';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useUpdateCourse(
  options?: UseMutationOptions<
    CreateCourseResponse,
    Error,
    UpdateCoursePayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ courseId, payload }: UpdateCoursePayload) =>
      HttpService.updateCourse({
        courseId,
        payload,
      }),
    onSuccess: (...args) => {
      const data = args[0];

      queryClient.invalidateQueries({
        queryKey: courseHttpKeys.listCourses(),
      });
      queryClient.invalidateQueries({
        queryKey: courseHttpKeys.getCourse(data.data.id),
      });
      options?.onSuccess?.(...args);
    },
  });
}
