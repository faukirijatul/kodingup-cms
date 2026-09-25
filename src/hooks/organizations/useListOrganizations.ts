import { useQuery } from '@tanstack/react-query';
import { organizationHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type { ListOrganizationsQueryParams } from '@/types/organization';

export function useListOrganizations(params: ListOrganizationsQueryParams) {
  return useQuery({
    queryKey: organizationHttpKeys.listOrganizations(params),
    queryFn: () => HttpService.listOrganizations(params),
  });
}
