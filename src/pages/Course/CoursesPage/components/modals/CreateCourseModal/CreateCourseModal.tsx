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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useListMentors } from '@/hooks/mentors/useListMentors';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCourse } from '@/hooks/courses/useCreateCourse';
import { toast } from 'sonner';
import { DataSelect } from '@/components/DataSelect';
import { MultiDataSelect } from '@/components/MultiDataSelect';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';
import { Input } from '@/components/ui/input';
import { useGetCourse } from '@/hooks/courses/useGetCourse';
import { CourseFormSkeleton } from './CourseFormSkeleton';
import { useUpdateCourse } from '@/hooks/courses/useUpdateCourse';
import { HttpService } from '@/services/http';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import {
  createCourseSchema,
  DEFAULT_COURSE_FORM_VALUES,
  type CreateCourseFormInput,
  type CreateCourseFormOutput,
} from '@/schemas/createCourse';
import { ThumbnailUploader } from '../ThumbnailUploader';

interface CreateCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCourseId: string;
}

export function CreateCourseModal({
  open,
  onOpenChange,
  selectedCourseId,
}: CreateCourseModalProps) {
  const [mentorPage, setMentorPage] = useState(DEFAULT_PAGE);
  const [isUploading, setIsUploading] = useState(false);

  const { data: courseResponse, isLoading: isCourseLoading } = useGetCourse(
    selectedCourseId,
    {
      enabled: !!selectedCourseId && open,
    },
  );

  const courseToEdit = courseResponse?.data;

  const { data: mentorsData, isLoading: isMentorsLoading } = useListMentors({
    offset: (mentorPage - DEFAULT_PAGE) * DEFAULT_PAGE_SIZE,
    limit: DEFAULT_PAGE_SIZE,
  });

  const mentorOptions = useMemo(() => {
    const options = (mentorsData?.data || []).map((mentor) => ({
      value: String(mentor.id),
      label: `${mentor.firstName} ${mentor.lastName}`,
    }));
    return options;
  }, [mentorsData]);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateCourseFormInput, unknown, CreateCourseFormOutput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: DEFAULT_COURSE_FORM_VALUES,
  });

  useEffect(() => {
    if (selectedCourseId && courseToEdit && open) {
      reset({
        thumbnailUrl: courseToEdit.thumbnailUrl || '',
        mentorId: courseToEdit.mentorId ? String(courseToEdit.mentorId) : '',
        title: courseToEdit.title || '',
        description: courseToEdit.description || '',
        organizationIds: (courseToEdit.organizationIds || []).map(String),
      });
    } else if (!selectedCourseId) {
      reset(DEFAULT_COURSE_FORM_VALUES);
    }
  }, [selectedCourseId, courseToEdit, reset, open]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedOrgIds = watch('organizationIds') || [];

  const {
    organizationOptions,
    page: orgPage,
    searchQuery: orgSearch,
    setPage: setOrgPage,
    handleSearchOrgChange,
    isOrgsLoading,
    totalOrgs,
  } = useOrganizationOptions({
    selectedOrgIds,
  });

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        reset(DEFAULT_COURSE_FORM_VALUES);
      }
      onOpenChange(isOpen);
    },
    [onOpenChange, reset],
  );

  const { mutate: createCourse, isPending: isCreateCourseLoading } =
    useCreateCourse({
      onSuccess: () => {
        toast.success('Course created successfully');
        reset(DEFAULT_COURSE_FORM_VALUES);
        onOpenChange(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to create course');
      },
    });

  const { mutate: updateCourse, isPending: isUpdateCourseLoading } =
    useUpdateCourse({
      onSuccess: () => {
        toast.success('Course updated successfully');
        reset(DEFAULT_COURSE_FORM_VALUES);
        onOpenChange(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed to update course');
      },
    });

  const isSubmitting = isCreateCourseLoading || isUpdateCourseLoading;

  const handleSubmitForm = useCallback(
    async (data: CreateCourseFormOutput) => {
      try {
        setIsUploading(true);
        let thumbnailUrl = data.thumbnailUrl;

        if (data.thumbnailUrl instanceof File) {
          thumbnailUrl = await HttpService.uploadToImageKit(data.thumbnailUrl);
        }

        const payload: CreateCourseFormOutput = {
          thumbnailUrl,
          mentorId: data.mentorId,
          title: data.title,
          description: data.description,
          organizationIds: data.organizationIds,
        };

        if (selectedCourseId) {
          updateCourse({ courseId: selectedCourseId, payload });
        } else {
          createCourse(payload);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [createCourse, selectedCourseId, updateCourse],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-xl">
        <DialogHeader className="mb-13 h-4.5!">
          <DialogTitle className="pb-0!">
            {selectedCourseId ? 'Edit' : 'Add'} Course
          </DialogTitle>
          <p className="text-muted h-5 text-sm leading-5 font-normal tracking-normal">
            {selectedCourseId
              ? 'Fill in the course details to edit course.'
              : 'Fill in the course details to create a new course.'}
          </p>
        </DialogHeader>

        {isCourseLoading ? (
          <CourseFormSkeleton />
        ) : (
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="flex flex-col pt-2.5"
          >
            <div className="flex flex-col gap-2.5 pb-6">
              <Label>Thumbnail</Label>
              <Controller
                control={control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <ThumbnailUploader
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.thumbnailUrl && (
                <p className="text-xs text-red-500">
                  {errors.thumbnailUrl.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 pb-6">
              <Label>Mentor</Label>
              <Controller
                control={control}
                name="mentorId"
                render={({ field }) => (
                  <DataSelect
                    key={field.value}
                    options={mentorOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select mentor"
                    pagination={{
                      page: mentorPage,
                      pageSize: DEFAULT_PAGE_SIZE,
                      total: mentorsData?.data.length || 0,
                      onPageChange: setMentorPage,
                    }}
                    isLoading={isMentorsLoading}
                    className="w-full"
                  />
                )}
              />
              {errors.mentorId && (
                <p className="text-xs text-red-500">
                  {errors.mentorId.message}
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
                    className="min-h-29.5"
                  />
                )}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 pb-6">
              <Label>Organization</Label>
              <Controller
                control={control}
                name="organizationIds"
                render={({ field }) => (
                  <MultiDataSelect
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
              {errors.organizationIds && (
                <p className="text-xs text-red-500">
                  {errors.organizationIds.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isUploading
                  ? 'Uploading image...'
                  : isSubmitting
                    ? 'Saving...'
                    : selectedCourseId
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
