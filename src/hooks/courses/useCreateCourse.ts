import { courseHttpKeys } from '@/configs/httpKeys';
import type { CreateCourseFormOutput } from '@/schemas/createCourse';
import { HttpService } from '@/services/http';
import type { CreateCourseResponse } from '@/types/course';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useCreateCourse(
  options?: UseMutationOptions<
    CreateCourseResponse,
    Error,
    CreateCourseFormOutput
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: CreateCourseFormOutput) =>
      HttpService.createCourse(payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: courseHttpKeys.listCourses(),
      });
      options?.onSuccess?.(...args);
    },
  });
}
