import { organizationHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import { useQuery } from '@tanstack/react-query';

interface UseGetOrganizationOptions {
  enabled?: boolean;
}

export function useGetOrganization(
  organizationId: string,
  { enabled }: UseGetOrganizationOptions = {},
) {
  return useQuery({
    queryKey: organizationHttpKeys.getOrganization(organizationId),
    queryFn: () => HttpService.getOrganization(organizationId),
    enabled,
  });
}
