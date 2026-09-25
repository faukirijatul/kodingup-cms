import { courseSectionModuleHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { ListCourseSectionModulesQueryParams } from '@/types/courseSectionModule';
import { useQuery } from '@tanstack/react-query';

export function useListCourseSectionModules(
  params: ListCourseSectionModulesQueryParams,
) {
  return useQuery({
    queryKey: courseSectionModuleHttpKeys.listCourseSectionModules(params),
    queryFn: () => HttpService.listCourseSectionModules(params),
  });
}
