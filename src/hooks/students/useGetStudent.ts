import { studentHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import { useQuery } from '@tanstack/react-query';

export function useGetStudent(studentId: string) {
  return useQuery({
    queryKey: studentHttpKeys.getStudent(studentId),
    queryFn: () => HttpService.getStudent(studentId),
  });
}
