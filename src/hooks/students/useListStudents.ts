import { useQuery } from '@tanstack/react-query';
import { studentHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { ListStudentsQueryParams } from '@/types/student';

export function useListStudents(params: ListStudentsQueryParams) {
  return useQuery({
    queryKey: studentHttpKeys.listStudents(params),
    queryFn: () => HttpService.listStudents(params),
  });
}
