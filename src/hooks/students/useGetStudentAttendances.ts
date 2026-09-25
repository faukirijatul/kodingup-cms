import { useQuery } from '@tanstack/react-query';
import { studentHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { GetStudentAttendancesParams } from '@/types/student';

export function useGetStudentAttendances(params: GetStudentAttendancesParams) {
  return useQuery({
    queryKey: studentHttpKeys.getStudentAttendances(params),
    queryFn: () => HttpService.getStudentAttendances(params),
  });
}
