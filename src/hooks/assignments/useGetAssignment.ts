import { assignmentHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import { useQuery } from '@tanstack/react-query';

interface UseGetAssignmentOptions {
  enabled?: boolean;
}

export function useGetAssignment(
  AssignmentId: string,
  { enabled }: UseGetAssignmentOptions = {},
) {
  return useQuery({
    queryKey: assignmentHttpKeys.getAssignment(AssignmentId),
    queryFn: () => HttpService.getAssignment(AssignmentId),
    enabled,
  });
}
