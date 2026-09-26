import { useQuery } from "@tanstack/react-query";
import { assignmentHttpKeys } from "@/configs/httpKeys";
import { HttpService } from "@/services/http";
import type { ListAssignmentsQueryParams } from "@/types/assignment";

export function useListAssignments(params: ListAssignmentsQueryParams) {
  return useQuery({
    queryKey: assignmentHttpKeys.listAssignments(params),
    queryFn: () => HttpService.listAssignments(params),
  });
}