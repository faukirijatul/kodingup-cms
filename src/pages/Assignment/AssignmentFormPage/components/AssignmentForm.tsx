import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  createAssignmentSchema,
  DEFAULT_ASSIGNMENT_FORM_VALUES,
  type CreateAssignmentFormInput,
  type CreateAssignmentFormOutput,
} from '@/schemas/createAssignment';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Assignment } from '@/types/assignment';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DataSelect } from '@/components/DataSelect';
import { Input } from '@/components/ui/input';
import { DateTimePicker } from '@/components/DateTimePicker';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { AssignmentStatus } from './AssignmentStatus';
import { useCreateAssignment } from '@/hooks/assignments/useCreateAssignment';
import { toast } from 'sonner';
import { useUpdateAssignment } from '@/hooks/assignments/useUpdateLiveSession';
import { RichTextEditor } from '@/components/RichTextEditor/RichTextEditor';

interface AssignmentFormProps {
  assignment?: Assignment;
}

export function AssignmentForm({ assignment }: AssignmentFormProps) {
  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateAssignmentFormInput, unknown, CreateAssignmentFormOutput>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: DEFAULT_ASSIGNMENT_FORM_VALUES,
  });

  useEffect(() => {
    if (assignment) {
      reset({
        organizationId: String(assignment.organizationId) || '',
        title: assignment.title || '',
        shortDescription: assignment.shortDescription || '',
        availableAt: assignment.availableAt || '',
        dueAt: assignment.dueAt || '',
        longDescription: assignment.longDescription || '',
      });
    } else {
      reset(DEFAULT_ASSIGNMENT_FORM_VALUES);
    }
  }, [assignment, reset]);

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

  const { mutate: createAssignment, isPending: isCreateAssignmentLoading } =
    useCreateAssignment({
      onSuccess: () => {
        toast.success('Assignment created successfully');
        reset(DEFAULT_ASSIGNMENT_FORM_VALUES);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to create assignment');
      },
    });

  const { mutate: updateAssignment, isPending: isUpdateAssignmentLoading } =
    useUpdateAssignment({
      onSuccess: () => {
        toast.success('Assignment updated successfully');
        reset(DEFAULT_ASSIGNMENT_FORM_VALUES);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to update assignment');
      },
    });

  const isSubmitting = isCreateAssignmentLoading || isUpdateAssignmentLoading;

  const handleSubmitForm = useCallback(
    async (data: CreateAssignmentFormOutput) => {
      if (assignment) {
        updateAssignment({ assignmentId: assignment.id, payload: data });
      } else {
        createAssignment(data);
      }
    },
    [assignment, createAssignment, updateAssignment],
  );

  return (
    <div className="flex items-start justify-between gap-7.5 px-6">
      <form
        id="assignment-form"
        onSubmit={handleSubmit(handleSubmitForm)}
        className="flex flex-1 flex-col"
      >
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

        <div className="flex flex-col gap-2.5 pb-5">
          <Label htmlFor="shortDescription">Description</Label>
          <Controller
            control={control}
            name="shortDescription"
            render={({ field }) => (
              <Textarea
                id="shortDescription"
                placeholder="Enter description"
                {...field}
                className="min-h-29.5"
              />
            )}
          />
          {errors.shortDescription && (
            <p className="text-xs text-red-500">
              {errors.shortDescription.message}
            </p>
          )}
        </div>

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

        <div className="flex w-full items-end justify-between gap-4 pb-6">
          <div className="flex flex-1 flex-col gap-2.5">
            <Label>Available Date</Label>
            <Controller
              control={control}
              name="availableAt"
              render={({ field }) => (
                <DateTimePicker
                  mode="date"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pick a date"
                />
              )}
            />
            {errors.availableAt && (
              <p className="text-xs text-red-500">
                {errors.availableAt.message}
              </p>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2.5">
            <Label>Due Date</Label>
            <Controller
              control={control}
              name="dueAt"
              render={({ field }) => (
                <DateTimePicker
                  mode="datetime"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pick a date and time"
                />
              )}
            />
            {errors.dueAt && (
              <p className="text-xs text-red-500">{errors.dueAt.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pb-5">
          <Label>Long Description</Label>
          <Controller
            control={control}
            name="longDescription"
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.longDescription && (
            <p className="text-xs text-red-500">
              {errors.longDescription.message}
            </p>
          )}
        </div>
      </form>

      <AssignmentStatus assignment={assignment} isSubmitting={isSubmitting} />
    </div>
  );
}
