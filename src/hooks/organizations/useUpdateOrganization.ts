import { organizationHttpKeys } from '@/configs/httpKeys';
import { HttpService } from '@/services/http';
import type {
  CreateOrganizationResponse,
  UpdateOrganizationPayload,
} from '@/types/organization';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useUpdateOrganization(
  options?: UseMutationOptions<
    CreateOrganizationResponse,
    Error,
    UpdateOrganizationPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ organizationId, payload }: UpdateOrganizationPayload) =>
      HttpService.updateOrganization({
        organizationId,
        payload,
      }),
    onSuccess: (...args) => {
      const data = args[0];

      queryClient.invalidateQueries({
        queryKey: organizationHttpKeys.listOrganizations(),
      });
      queryClient.invalidateQueries({
        queryKey: organizationHttpKeys.getOrganization(data.data.id),
      });
      options?.onSuccess?.(...args);
    },
  });
}
