import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateOrganization } from '@/hooks/organizations/useCreateOrganization';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useGetOrganization } from '@/hooks/organizations/useGetOrganization';
import { useUpdateOrganization } from '@/hooks/organizations/useUpdateOrganization';
import {
  createOrganizationSchema,
  type CreateOrganizationFormValues,
} from '@/schemas/createOrganization';
import { OrganizationFormSkeleton } from './OrganizationFormSkeleton';

const DEFAULT_FORM_VALUES: CreateOrganizationFormValues = {
  name: '',
};

interface CreateOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOrganizationId: string;
}

export function CreateOrganizationModal({
  open,
  onOpenChange,
  selectedOrganizationId,
}: CreateOrganizationModalProps) {
  const { data: organizationResponse, isLoading: isOrganizationLoading } =
    useGetOrganization(selectedOrganizationId, {
      enabled: !!selectedOrganizationId && open,
    });

  const organizationToEdit = organizationResponse?.data;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (selectedOrganizationId && organizationToEdit && open) {
      reset({
        name: organizationToEdit.name || '',
      });
    } else if (!selectedOrganizationId) {
      reset(DEFAULT_FORM_VALUES);
    }
  }, [selectedOrganizationId, organizationToEdit, reset, open]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        reset(DEFAULT_FORM_VALUES);
      }
      onOpenChange(isOpen);
    },
    [onOpenChange, reset],
  );

  const { mutate: createOrganization, isPending: isCreateOrganizationLoading } =
    useCreateOrganization({
      onSuccess: () => {
        toast.success('Organization created successfully');
        reset(DEFAULT_FORM_VALUES);
        onOpenChange(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to create organization');
      },
    });

  const { mutate: updateOrganization, isPending: isUpdateOrganizationLoading } =
    useUpdateOrganization({
      onSuccess: () => {
        toast.success('Organization updated successfully');
        reset(DEFAULT_FORM_VALUES);
        onOpenChange(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to update organization');
      },
    });

  const isSubmitting =
    isCreateOrganizationLoading || isUpdateOrganizationLoading;

  const handleSubmitForm = useCallback(
    async (data: CreateOrganizationFormValues) => {
      if (selectedOrganizationId) {
        updateOrganization({
          organizationId: selectedOrganizationId,
          payload: data,
        });
      } else {
        createOrganization(data);
      }
    },
    [createOrganization, selectedOrganizationId, updateOrganization],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-xl">
        <DialogHeader className="mb-13 h-4.5!">
          <DialogTitle className="pb-0!">
            {selectedOrganizationId ? 'Edit' : 'Add'} Organization
          </DialogTitle>
        </DialogHeader>

        {isOrganizationLoading ? (
          <OrganizationFormSkeleton />
        ) : (
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="flex flex-col pt-2.5"
          >
            <div className="flex flex-col gap-2.5 pb-6">
              <Label htmlFor="name">Organization Name</Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="Enter name"
                    {...field}
                    className="h-9"
                  />
                )}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : selectedOrganizationId
                    ? 'Update'
                    : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
