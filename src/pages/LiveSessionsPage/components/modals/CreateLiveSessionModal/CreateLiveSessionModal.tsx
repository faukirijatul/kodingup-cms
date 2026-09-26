import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { DataSelect } from '@/components/DataSelect';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';
import { Input } from '@/components/ui/input';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { useGetLiveSession } from '@/hooks/liveSessions/useGetLiveSession';
import {
  createLiveSessionSchema,
  DEFAULT_LIVE_SESSION_FORM_VALUES,
  type CreateLiveSessionFormInput,
  type CreateLiveSessionFormOutput,
} from '@/schemas/createLiveSession';
import { useCreateLiveSession } from '@/hooks/liveSessions/useCreateLiveSession';
import { useUpdateLiveSession } from '@/hooks/liveSessions/useUpdateLiveSession';
import { DateTimePicker } from '@/components/DateTimePicker';
import { LiveSessionFormSkeleton } from './LiveSessionFormSkeleton';

interface CreateLiveSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLiveSessionId: string;
}

export function CreateLiveSessionModal({
  open,
  onOpenChange,
  selectedLiveSessionId,
}: CreateLiveSessionModalProps) {
  const { data: liveSession, isLoading: isLiveSessionLoading } =
    useGetLiveSession(selectedLiveSessionId, {
      enabled: !!selectedLiveSessionId && open,
    });

  const liveSessionToEdit = liveSession?.data;

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateLiveSessionFormInput, unknown, CreateLiveSessionFormOutput>(
    {
      resolver: zodResolver(createLiveSessionSchema),
      defaultValues: DEFAULT_LIVE_SESSION_FORM_VALUES,
    },
  );

  useEffect(() => {
    if (selectedLiveSessionId && liveSessionToEdit && open) {
      reset({
        organizationId: String(liveSessionToEdit.organizationId) || '',
        title: liveSessionToEdit.title || '',
        startAt: liveSessionToEdit.startAt || '',
        endAt: liveSessionToEdit.endAt || '',
        description: liveSessionToEdit.description || '',
      });
    } else if (!selectedLiveSessionId) {
      reset(DEFAULT_LIVE_SESSION_FORM_VALUES);
    }
  }, [selectedLiveSessionId, liveSessionToEdit, reset, open]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedOrgId = watch('organizationId');

  const {
    organizationOptions,
    page: orgPage,
    searchQuery: orgSearch,
    setPage: setOrgPage,
    handleSearchOrgChange,
    isOrgsLoading,
    totalOrgs,
  } = useOrganizationOptions({
    selectedOrgId,
  });

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        reset(DEFAULT_LIVE_SESSION_FORM_VALUES);
      }
      onOpenChange(isOpen);
    },
    [onOpenChange, reset],
  );

  const { mutate: createLiveSession, isPending: isCreateLiveSessionLoading } =
    useCreateLiveSession({
      onSuccess: () => {
        toast.success('Live session created successfully');
        reset(DEFAULT_LIVE_SESSION_FORM_VALUES);
        onOpenChange(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to create live session');
      },
    });

  const { mutate: updateLiveSession, isPending: isUpdateLiveSessionLoading } =
    useUpdateLiveSession({
      onSuccess: () => {
        toast.success('Live session updated successfully');
        reset(DEFAULT_LIVE_SESSION_FORM_VALUES);
        onOpenChange(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to update live session');
      },
    });

  const isSubmitting = isCreateLiveSessionLoading || isUpdateLiveSessionLoading;

  const handleSubmitForm = useCallback(
    async (data: CreateLiveSessionFormOutput) => {
      if (selectedLiveSessionId) {
        updateLiveSession({
          liveSessionId: selectedLiveSessionId,
          payload: data,
        });
      } else {
        createLiveSession(data);
      }
    },
    [createLiveSession, selectedLiveSessionId, updateLiveSession],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-155.5">
        <DialogHeader className="h-9.5">
          <DialogTitle>
            {selectedLiveSessionId ? 'Edit' : 'Create'} Live Session
          </DialogTitle>
        </DialogHeader>

        {isLiveSessionLoading ? (
          <LiveSessionFormSkeleton />
        ) : (
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="flex flex-col pt-2.5"
          >
            <div className="flex flex-col gap-2.5 pb-6">
              <Label>Organization</Label>
              <Controller
                control={control}
                name="organizationId"
                render={({ field }) => (
                  <DataSelect
                    key={field.value}
                    searchable
                    options={organizationOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select organization"
                    searchPlaceholder="Search organization"
                    searchQuery={orgSearch}
                    onSearchChange={handleSearchOrgChange}
                    pagination={{
                      page: orgPage,
                      pageSize: DEFAULT_PAGE_SIZE,
                      total: totalOrgs,
                      onPageChange: setOrgPage,
                    }}
                    isLoading={isOrgsLoading}
                    className="w-full"
                  />
                )}
              />
              {errors.organizationId && (
                <p className="text-xs text-red-500">
                  {errors.organizationId.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 pb-6">
              <Label htmlFor="title">Title</Label>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Input
                    id="title"
                    placeholder="Enter title"
                    {...field}
                    className="h-9"
                  />
                )}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="flex w-full items-end justify-between gap-4 pb-6">
              <div className="flex flex-1 flex-col gap-2.5">
                <Label>Start Time</Label>
                <Controller
                  control={control}
                  name="startAt"
                  render={({ field }) => (
                    <DateTimePicker
                      mode="datetime"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date and time"
                    />
                  )}
                />
                {errors.startAt && (
                  <p className="text-xs text-red-500">
                    {errors.startAt.message}
                  </p>
                )}
              </div>

              <div className="border-dark h-4.25 w-4 border-t" />

              <div className="flex flex-1 flex-col gap-2.5">
                <Label>End Time</Label>
                <Controller
                  control={control}
                  name="endAt"
                  render={({ field }) => (
                    <DateTimePicker
                      mode="datetime"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date and time"
                    />
                  )}
                />
                {errors.endAt && (
                  <p className="text-xs text-red-500">{errors.endAt.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pb-5">
              <Label htmlFor="description">Description</Label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    {...field}
                    className="min-h-43.75"
                  />
                )}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
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
                  : selectedLiveSessionId
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
