import { organizationHttpKeys } from '@/configs/httpKeys';
import type { CreateOrganizationFormValues } from '@/schemas/createOrganization';
import { HttpService } from '@/services/http';
import type { CreateOrganizationResponse } from '@/types/organization';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

export function useCreateOrganization(
  options?: UseMutationOptions<
    CreateOrganizationResponse,
    Error,
    CreateOrganizationFormValues
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: CreateOrganizationFormValues) =>
      HttpService.createOrganization(payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: organizationHttpKeys.listOrganizations(),
      });
      options?.onSuccess?.(...args);
    },
  });
}
