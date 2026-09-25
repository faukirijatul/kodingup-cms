import { organizationHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useDeleteOrganization(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (organizationId: string) =>
      HttpService.deleteOrganization(organizationId),
    onSuccess: (...args) => {
      const variables = args[1];

      queryClient.invalidateQueries({
        queryKey: organizationHttpKeys.listOrganizations(),
      });
      queryClient.removeQueries({
        queryKey: organizationHttpKeys.getOrganization(variables),
      });

      options?.onSuccess?.(...args);
    },
  });
}
