import { courseSectionHttpKeys } from "@/configs/httpKeys";
import { HttpService } from "@/services/http";
import type { ListCourseSectionsQueryParams } from "@/types/courseSection";
import { useQuery } from "@tanstack/react-query";

export function useListCourseSections(params: ListCourseSectionsQueryParams) {
  return useQuery({
    queryKey: courseSectionHttpKeys.listCourseSections(params),
    queryFn: () => HttpService.listCourseSections(params),
  });
}